import React, { useState, useEffect, useMemo } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import classnames from 'classnames';
import { usePracticeStore } from '@/store/usePracticeStore';
import materials from '@/data/materials';
import SceneTag from '@/components/SceneTag';
import DialogueCard from '@/components/DialogueCard';
import type { Material, SceneType, DialogueTurn } from '@/types';
import { SCENE_INFO } from '@/types';
import { formatDuration, formatDate, getQualityLabel } from '@/utils';
import styles from './index.module.scss';

const MaterialDetailPage: React.FC = () => {
  const [material, setMaterial] = useState<Material | null>(null);
  const [notFound, setNotFound] = useState(false);
  const customMaterials = usePracticeStore(state => state.customMaterials);

  useEffect(() => {
    const params = Taro.getCurrentInstance().router?.params;
    const id = params?.id;

    if (!id) {
      setNotFound(true);
      return;
    }

    const custom = customMaterials.find(m => m.id === id);
    if (custom) {
      setMaterial(custom);
      return;
    }

    const staticMat = materials.find(m => m.id === id);
    if (staticMat) {
      setMaterial(staticMat);
      return;
    }

    setNotFound(true);
  }, [customMaterials]);

  const segmentStats = useMemo(() => {
    if (!material) return [];
    const stats: Record<string, number> = {};
    material.dialogue.forEach(turn => {
      const seg = turn.segment || material.scene;
      stats[seg] = (stats[seg] || 0) + 1;
    });
    return Object.entries(stats).map(([segment, count]) => ({
      segment: segment as SceneType,
      count
    }));
  }, [material]);

  const groupedDialogue = useMemo(() => {
    if (!material) return {} as Record<SceneType, DialogueTurn[]>;
    const groups: Record<SceneType, DialogueTurn[]> = {
      opening: [],
      clarify: [],
      comfort: [],
      closing: []
    };
    material.dialogue.forEach(turn => {
      const seg = turn.segment || material.scene;
      groups[seg].push(turn);
    });
    return groups;
  }, [material]);

  if (notFound) {
    return (
      <View className={styles.pageContainer}>
        <View className={styles.notFound}>
          <Text className={styles.notFoundIcon}>📭</Text>
          <Text className={styles.notFoundTitle}>素材不存在</Text>
          <Text className={styles.notFoundDesc}>该素材可能已被删除或ID无效</Text>
        </View>
      </View>
    );
  }

  if (!material) {
    return (
      <View className={styles.pageContainer}>
        <View className={styles.notFound}>
          <Text className={styles.notFoundIcon}>⏳</Text>
          <Text className={styles.notFoundTitle}>加载中...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className={styles.pageContainer} scrollY>
      <View className={styles.headerCard}>
        <Text className={styles.materialTitle}>{material.title}</Text>
        <View className={styles.tagRow}>
          <SceneTag scene={material.scene} size="sm" />
          <View
            className={classnames(styles.qualityTag, material.quality === 'excellent' ? styles.excellent : styles.failed)}
          >
            <Text className={styles.qualityTagText}>{getQualityLabel(material.quality)}</Text>
          </View>
        </View>
      </View>

      <View className={styles.summaryCard}>
        <View className={styles.sectionHeader}>
          <View className={styles.sectionIcon} />
          <Text className={styles.sectionTitle}>通话摘要</Text>
        </View>
        <Text className={styles.summaryText}>{material.summary}</Text>
      </View>

      <View className={styles.infoCard}>
        <View className={styles.sectionHeader}>
          <View className={styles.sectionIcon} />
          <Text className={styles.sectionTitle}>通话信息</Text>
        </View>
        <View className={styles.infoGrid}>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>通话时长</Text>
            <Text className={styles.infoValue}>{formatDuration(material.duration)}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>通话日期</Text>
            <Text className={styles.infoValue}>{formatDate(material.date)}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>行业分类</Text>
            <Text className={styles.infoValue}>{material.category}</Text>
          </View>
        </View>
      </View>

      {segmentStats.length > 0 && (
        <View className={styles.segmentCard}>
          <View className={styles.sectionHeader}>
            <View className={styles.sectionIcon} />
            <Text className={styles.sectionTitle}>片段分类</Text>
          </View>
          <View className={styles.segmentList}>
            {segmentStats.map(item => (
              <View key={item.segment} className={styles.segmentItem}>
                <SceneTag scene={item.segment} size="sm" />
                <Text className={styles.segmentCount}>{item.count} 句</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View className={styles.dialogueCard}>
        <View className={styles.sectionHeader}>
          <View className={styles.sectionIcon} />
          <Text className={styles.sectionTitle}>完整对话</Text>
          <Text className={styles.dialogueCount}>共 {material.dialogue.length} 句</Text>
        </View>
        <View className={styles.dialogueList}>
          {(['opening', 'clarify', 'comfort', 'closing'] as SceneType[]).map(seg => {
            const turns = groupedDialogue[seg] || [];
            if (turns.length === 0) return null;
            return (
              <View key={seg} className={styles.sceneBlock}>
                <View className={styles.sceneBlockHeader}>
                  <SceneTag scene={seg} size="sm" />
                  <Text className={styles.sceneBlockTitle}>{SCENE_INFO[seg].label}</Text>
                </View>
                {turns.map(turn => (
                  <View key={turn.id} className={styles.dialogueItem}>
                    <View className={styles.dialogueCardWrapper}>
                      <DialogueCard dialogue={turn} showTimestamp />
                    </View>
                  </View>
                ))}
              </View>
            );
          })}
        </View>
      </View>

      <View className={styles.bottomSpacer} />
    </ScrollView>
  );
};

export default MaterialDetailPage;
