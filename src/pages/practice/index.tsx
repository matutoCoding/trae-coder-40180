import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import SceneTag from '@/components/SceneTag';
import DialogueCard from '@/components/DialogueCard';
import OptionCard from '@/components/OptionCard';
import AITip from '@/components/AITip';
import ProgressBar from '@/components/ProgressBar';
import { usePracticeStore } from '@/store/usePracticeStore';
import { getTodayQuestions, getQuestionById } from '@/data/practice';
import { calcCorrectRate } from '@/utils';
import type { PracticeQuestion } from '@/types';
import styles from './index.module.scss';

const PracticePage: React.FC = () => {
  const {
    currentQuestionIndex,
    selectedOptionId,
    showAnswer,
    isPracticeComplete,
    userInfo,
    setSelectedOption,
    submitAnswer,
    nextQuestion,
    resetPractice
  } = usePracticeStore();

  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [correctCount, setCorrectCount] = useState(0);

  const questionIdRef = useRef<string | undefined>(
    Taro.getCurrentInstance().router?.params?.questionId
  );

  useEffect(() => {
    const targetId = questionIdRef.current;
    let loadedQuestions: PracticeQuestion[];

    if (targetId) {
      const question = getQuestionById(targetId);
      loadedQuestions = question ? [question] : getTodayQuestions();
      console.log('[Practice] 从错题本跳转，加载单题', { questionId: targetId, found: !!question });
    } else {
      loadedQuestions = getTodayQuestions();
      console.log('[Practice] 加载今日练习题', { count: loadedQuestions.length });
    }

    setQuestions(loadedQuestions);
    usePracticeStore.setState({ todayQuestions: loadedQuestions });
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (optionId: string) => {
    if (showAnswer) return;
    setSelectedOption(optionId);
    console.log('[Practice] 选择选项', { optionId });
  };

  const handleSubmit = () => {
    if (!selectedOptionId) {
      Taro.showToast({ title: '请先选择一个选项', icon: 'none' });
      return;
    }

    const selectedOption = currentQuestion?.options.find(opt => opt.id === selectedOptionId);
    if (selectedOption?.isCorrect) {
      setCorrectCount(prev => prev + 1);
    }

    submitAnswer();
    console.log('[Practice] 提交答案', {
      questionId: currentQuestion?.id,
      selectedOptionId,
      isCorrect: selectedOption?.isCorrect
    });
  };

  const handleNext = () => {
    nextQuestion();
  };

  const handleRetry = () => {
    resetPractice();
    setCorrectCount(0);
    const targetId = questionIdRef.current;
    let loadedQuestions: PracticeQuestion[];

    if (targetId) {
      const question = getQuestionById(targetId);
      loadedQuestions = question ? [question] : getTodayQuestions();
    } else {
      loadedQuestions = getTodayQuestions();
    }

    setQuestions(loadedQuestions);
    usePracticeStore.setState({ todayQuestions: loadedQuestions });
    console.log('[Practice] 重新开始练习', { isRetryQuestion: !!targetId });
  };

  const isSelectedCorrect = () => {
    const selectedOption = currentQuestion?.options.find(opt => opt.id === selectedOptionId);
    return selectedOption?.isCorrect || false;
  };

  if (questions.length === 0) {
    return (
      <View className={styles.pageContainer}>
        <View className={styles.completeCard}>
          <Text className={styles.completeTitle}>加载中...</Text>
        </View>
      </View>
    );
  }

  if (isPracticeComplete) {
    const rate = calcCorrectRate(correctCount, questions.length);
    return (
      <ScrollView className={styles.pageContainer} scrollY>
        <View className={styles.completeCard}>
          <View className={styles.completeIcon}>
            <Text className={styles.completeIconText}>✓</Text>
          </View>
          <Text className={styles.completeTitle}>
            {questionIdRef.current ? '错题重练完成！' : '今日训练完成！'}
          </Text>
          <Text className={styles.completeSubtitle}>
            {rate >= 80 ? '太棒了！继续保持！' : rate >= 60 ? '不错哦，还有提升空间！' : '加油，多多练习！'}
          </Text>
          
          <View className={styles.completeStats}>
            <View className={styles.completeStatItem}>
              <Text className={styles.completeStatValue}>{correctCount}</Text>
              <Text className={styles.completeStatLabel}>答对题数</Text>
            </View>
            <View className={styles.completeStatItem}>
              <Text className={styles.completeStatValue}>{questions.length}</Text>
              <Text className={styles.completeStatLabel}>总题数</Text>
            </View>
            <View className={styles.completeStatItem}>
              <Text className={styles.completeStatValue}>{rate}%</Text>
              <Text className={styles.completeStatLabel}>正确率</Text>
            </View>
          </View>

          <Button className={styles.retryBtn} onClick={handleRetry}>
            再来一组
          </Button>
        </View>
      </ScrollView>
    );
  }

  return (
    <>
      <ScrollView className={styles.pageContainer} scrollY>
        <View className={styles.headerCard}>
          <View className={styles.headerTop}>
            <View className={styles.greetingSection}>
              <Text className={styles.greetingText}>你好，{userInfo.name}</Text>
              <Text className={styles.subGreeting}>今天也要加油练习哦！</Text>
            </View>
            <View className={styles.streakBadge}>
              <Text className={styles.streakNumber}>{userInfo.stats.streakDays}</Text>
              <Text className={styles.streakLabel}>连续学习</Text>
            </View>
          </View>
          <View className={styles.statsRow}>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{currentQuestionIndex + 1}</Text>
              <Text className={styles.statLabel}>当前进度</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{questions.length}</Text>
              <Text className={styles.statLabel}>今日题数</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{calcCorrectRate(userInfo.stats.sceneStats.opening.correct + userInfo.stats.sceneStats.clarify.correct + userInfo.stats.sceneStats.comfort.correct + userInfo.stats.sceneStats.closing.correct, userInfo.stats.totalQuestions)}%</Text>
              <Text className={styles.statLabel}>累计正确率</Text>
            </View>
          </View>
        </View>

        <View className={styles.questionHeader}>
          <SceneTag scene={currentQuestion.scene} size="md" />
          <Text className={styles.questionProgress}>
            第 {currentQuestionIndex + 1} 题 / 共 {questions.length} 题
          </Text>
        </View>

        <ProgressBar
          current={currentQuestionIndex + 1}
          total={questions.length}
          showText={false}
          className={styles.mbLg}
        />

        <View className={styles.customerSection}>
          <View className={styles.sectionTitle}>
            <View className={styles.titleIcon} />
            <Text>客户原话</Text>
          </View>
          <DialogueCard
            dialogue={{
              id: 'customer',
              speaker: 'customer',
              content: currentQuestion.customerContent
            }}
            showTimestamp={false}
          />
        </View>

        <View className={styles.sectionTitle}>
          <View className={styles.titleIcon} />
          <Text>你会如何回应？</Text>
        </View>

        {currentQuestion.options.map((option, index) => (
          <OptionCard
            key={option.id}
            option={option}
            optionLabel={String.fromCharCode(65 + index)}
            isSelected={selectedOptionId === option.id}
            showResult={showAnswer}
            disabled={showAnswer}
            onClick={() => handleOptionSelect(option.id)}
          />
        ))}

        {showAnswer && (
          <View className={styles.answerSection}>
            <View
              className={classnames(
                styles.resultBanner,
                isSelectedCorrect() ? styles.correct : styles.wrong
              )}
            >
              <View className={classnames(styles.resultIcon, isSelectedCorrect() ? styles.correct : styles.wrong)}>
                <Text className={styles.resultIconText}>
                  {isSelectedCorrect() ? '✓' : '✕'}
                </Text>
              </View>
              <View className={styles.resultTextWrapper}>
                <Text className={styles.resultTitle}>
                  {isSelectedCorrect() ? '回答正确！' : '回答有误'}
                </Text>
                <Text className={styles.resultSubtitle}>
                  {isSelectedCorrect()
                    ? '很棒！你的回答符合规范要求'
                    : '没关系，一起来学习正确的处理方式'}
                </Text>
              </View>
            </View>

            <View className={styles.revealSection}>
              <View className={styles.answerCard}>
                <View className={styles.answerCardTitle}>
                  <View className={classnames(styles.answerBadge, styles.agent)}>原坐席回答</View>
                </View>
                <Text className={styles.answerContent}>{currentQuestion.agentAnswer}</Text>
              </View>

              <View className={styles.answerCard}>
                <View className={styles.answerCardTitle}>
                  <View className={classnames(styles.answerBadge, styles.quality)}>质检点评</View>
                </View>
                <Text className={styles.answerContent}>{currentQuestion.qualityReview}</Text>
              </View>

              <AITip
                title="AI推荐话术"
                content={currentQuestion.recommendedScript}
                type={isSelectedCorrect() ? 'success' : 'info'}
              />

              <AITip
                title="要点解析"
                content={currentQuestion.explanation}
                type="info"
              />
            </View>
          </View>
        )}
      </ScrollView>

      <View className={styles.bottomBar}>
        {!showAnswer ? (
          <Button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={!selectedOptionId}
          >
            提交答案
          </Button>
        ) : (
          <Button className={styles.submitBtn} onClick={handleNext}>
            {currentQuestionIndex + 1 >= questions.length ? '完成练习' : '下一题'}
          </Button>
        )}
      </View>
    </>
  );
};

export default PracticePage;
