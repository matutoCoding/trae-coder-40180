import React, { useState, useMemo } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import DialogueCard from '@/components/DialogueCard';
import SceneTag from '@/components/SceneTag';
import materials from '@/data/materials';
import { usePracticeStore } from '@/store/usePracticeStore';
import { formatDuration, formatDate, getQualityLabel, getQualityColor, getSceneLabel } from '@/utils';
import type { SceneType, MaterialQuality, AddMaterialForm, Material } from '@/types';
import { SCENE_INFO } from '@/types';
import styles from './index.module.scss';

const staticMaterials = materials;

const industryOptions = ['保险理赔', '电商售后', '在线教育', '银行服务', '医疗咨询'];

const sceneOptions: Array<{ value: SceneType | 'all'; label: string }> = [
  { value: 'all', label: '全部场景' },
  { value: 'opening', label: '开场确认' },
  { value: 'clarify', label: '需求澄清' },
  { value: 'comfort', label: '情绪安抚' },
  { value: 'closing', label: '结束确认' }
];

const formSceneOptions: Array<{ value: SceneType; label: string }> = [
  { value: 'opening', label: '开场确认' },
  { value: 'clarify', label: '需求澄清' },
  { value: 'comfort', label: '情绪安抚' },
  { value: 'closing', label: '结束确认' }
];

const LibraryPage: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedScene, setSelectedScene] = useState<SceneType | 'all'>('all');
  const [selectedQuality, setSelectedQuality] = useState<MaterialQuality | 'all'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formQuality, setFormQuality] = useState<MaterialQuality>('excellent');
  const [formCategory, setFormCategory] = useState('保险理赔');
  const [formScene, setFormScene] = useState<SceneType>('opening');
  const [lastAddedMaterial, setLastAddedMaterial] = useState<Material | null>(null);

  const { customMaterials, addCustomMaterial } = usePracticeStore();

  const allMaterials = useMemo(() => {
    return [...customMaterials, ...staticMaterials];
  }, [customMaterials]);

  const filteredMaterials = useMemo(() => {
    return allMaterials.filter(m => {
      const matchKeyword = searchKeyword === '' ||
        m.title.includes(searchKeyword) ||
        m.summary.includes(searchKeyword) ||
        m.category.includes(searchKeyword);
      const matchScene = selectedScene === 'all' || m.scene === selectedScene;
      const matchQuality = selectedQuality === 'all' || m.quality === selectedQuality;
      return matchKeyword && matchScene && matchQuality;
    });
  }, [allMaterials, searchKeyword, selectedScene, selectedQuality]);

  const handleMaterialClick = (material: Material) => {
    Taro.navigateTo({
      url: `/pages/material-detail/index?id=${material.id}`
    });
    console.log('[Library] 查看素材详情', { materialId: material.id, title: material.title });
  };

  const handleSceneChange = (scene: SceneType | 'all') => {
    setSelectedScene(scene);
    console.log('[Library] 切换场景筛选', { scene });
  };

  const handleQualityChange = (quality: MaterialQuality | 'all') => {
    setSelectedQuality(quality);
    console.log('[Library] 切换质量筛选', { quality });
  };

  const handleAddSubmit = () => {
    if (!formTitle.trim()) {
      Taro.showToast({ title: '请输入素材标题', icon: 'none' });
      return;
    }
    const form: AddMaterialForm = {
      title: formTitle.trim(),
      quality: formQuality,
      scene: formScene,
      category: formCategory
    };
    const newMaterial = addCustomMaterial(form);
    setLastAddedMaterial(newMaterial);
    Taro.showToast({ title: '添加成功', icon: 'success' });
    setFormTitle('');
    setFormQuality('excellent');
    setFormCategory('保险理赔');
    setFormScene('opening');
    setShowAddForm(false);
    console.log('[Library] 添加录音素材', { id: newMaterial.id, title: newMaterial.title });
  };

  return (
    <ScrollView className={styles.pageContainer} scrollY>
      <View className={styles.headerSection}>
        <Text className={styles.pageTitle}>素材库</Text>
        <Text className={styles.pageSubtitle}>学习真实通话案例，掌握专业话术技巧</Text>

        <View
          className={styles.addBtn}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Text className={styles.addBtnText}>{showAddForm ? '收起表单' : '＋ 添加素材'}</Text>
        </View>

        {showAddForm && (
          <View className={styles.addFormSection}>
            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>素材标题</Text>
              <Input
                className={styles.formInput}
                placeholder="请输入素材标题"
                value={formTitle}
                onInput={(e) => setFormTitle(e.detail.value)}
              />
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>质量选择</Text>
              <View className={styles.qualityFilter}>
                <View
                  className={classnames(
                    styles.qualityTab,
                    formQuality === 'excellent' && styles.active,
                    styles.excellent
                  )}
                  onClick={() => setFormQuality('excellent')}
                >
                  <Text className={styles.qualityTabText}>优秀案例</Text>
                </View>
                <View
                  className={classnames(
                    styles.qualityTab,
                    formQuality === 'failed' && styles.active,
                    styles.failed
                  )}
                  onClick={() => setFormQuality('failed')}
                >
                  <Text className={styles.qualityTabText}>待改进</Text>
                </View>
              </View>
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>行业场景</Text>
              <ScrollView scrollX className={styles.industryScroll}>
                <View className={styles.industryTags}>
                  {industryOptions.map(item => (
                    <View
                      key={item}
                      className={classnames(
                        styles.sceneTag,
                        formCategory === item && styles.active
                      )}
                      onClick={() => setFormCategory(item)}
                    >
                      <Text className={styles.sceneTagText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>话术环节</Text>
              <View className={styles.sceneTags}>
                {formSceneOptions.map(opt => (
                  <View
                    key={opt.value}
                    className={classnames(
                      styles.sceneTag,
                      formScene === opt.value && styles.active
                    )}
                    onClick={() => setFormScene(opt.value)}
                  >
                    <Text className={styles.sceneTagText}>{opt.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.submitBtn} onClick={handleAddSubmit}>
              <Text className={styles.submitBtnText}>提交</Text>
            </View>
          </View>
        )}

        {lastAddedMaterial && (
          <View className={styles.resultSection}>
            <Text className={styles.resultTitle}>转写结果</Text>

            <View className={styles.dialogueList}>
              {lastAddedMaterial.dialogue.map(turn => (
                <DialogueCard key={turn.id} dialogue={turn} showTimestamp />
              ))}
            </View>

            <Text className={styles.resultSubtitle}>切分片段</Text>
            <View className={styles.segmentList}>
              {lastAddedMaterial.tags.map((tag, idx) => (
                <SceneTag key={idx} scene={tag as SceneType} size="sm" />
              ))}
            </View>
          </View>
        )}

        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="搜索素材标题、内容..."
            value={searchKeyword}
            onInput={(e) => setSearchKeyword(e.detail.value)}
            confirmType="search"
          />
        </View>

        <View className={styles.filterSection}>
          <Text className={styles.filterLabel}>场景分类</Text>
          <View className={styles.sceneTags}>
            {sceneOptions.map(scene => (
              <View
                key={scene.value}
                className={classnames(
                  styles.sceneTag,
                  selectedScene === scene.value && styles.active
                )}
                onClick={() => handleSceneChange(scene.value)}
              >
                <Text className={styles.sceneTagText}>{scene.label}</Text>
              </View>
            ))}
          </View>

          <Text className={styles.filterLabel}>质量筛选</Text>
          <View className={styles.qualityFilter}>
            <View
              className={classnames(
                styles.qualityTab,
                selectedQuality === 'all' && styles.active,
                styles.excellent
              )}
              onClick={() => handleQualityChange('all')}
            >
              <Text className={styles.qualityTabText}>全部</Text>
            </View>
            <View
              className={classnames(
                styles.qualityTab,
                selectedQuality === 'excellent' && styles.active,
                styles.excellent
              )}
              onClick={() => handleQualityChange('excellent')}
            >
              <Text className={styles.qualityTabText}>优秀案例</Text>
            </View>
            <View
              className={classnames(
                styles.qualityTab,
                selectedQuality === 'failed' && styles.active,
                styles.failed
              )}
              onClick={() => handleQualityChange('failed')}
            >
              <Text className={styles.qualityTabText}>待改进</Text>
            </View>
          </View>
        </View>
      </View>

      {filteredMaterials.length > 0 ? (
        <View className={styles.materialList}>
          {filteredMaterials.map(material => (
            <View
              key={material.id}
              className={styles.materialCard}
              onClick={() => handleMaterialClick(material)}
            >
              <View className={styles.cardHeader}>
                <SceneTag scene={material.scene} size="sm" />
                <View
                  className={classnames(styles.qualityBadge, material.quality)}
                  style={{
                    background: `${getQualityColor(material.quality)}15`,
                    color: getQualityColor(material.quality)
                  }}
                >
                  <Text>{getQualityLabel(material.quality)}</Text>
                </View>
              </View>

              <Text className={styles.materialTitle}>{material.title}</Text>
              <Text className={styles.materialSummary}>{material.summary}</Text>

              <View className={styles.cardFooter}>
                <View className={styles.metaInfo}>
                  <View className={styles.metaItem}>
                    <Text>⏱️</Text>
                    <Text>{formatDuration(material.duration)}</Text>
                  </View>
                  <View className={styles.metaItem}>
                    <Text>📅</Text>
                    <Text>{formatDate(material.date)}</Text>
                  </View>
                </View>
                <View className={styles.categoryTag}>
                  <Text>{material.category}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📭</Text>
          <Text className={styles.emptyText}>暂无符合条件的素材</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default LibraryPage;
