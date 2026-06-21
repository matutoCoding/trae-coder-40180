import React, { useState, useMemo } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import SceneTag from '@/components/SceneTag';
import materials from '@/data/materials';
import { formatDuration, formatDate, getQualityLabel, getQualityColor } from '@/utils';
import type { SceneType, MaterialQuality, Material } from '@/types';
import styles from './index.module.scss';

const LibraryPage: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedScene, setSelectedScene] = useState<SceneType | 'all'>('all');
  const [selectedQuality, setSelectedQuality] = useState<MaterialQuality | 'all'>('all');

  const sceneOptions: Array<{ value: SceneType | 'all'; label: string }> = [
    { value: 'all', label: '全部场景' },
    { value: 'opening', label: '开场确认' },
    { value: 'clarify', label: '需求澄清' },
    { value: 'comfort', label: '情绪安抚' },
    { value: 'closing', label: '结束确认' }
  ];

  const filteredMaterials = useMemo(() => {
    return materials.filter(m => {
      const matchKeyword = searchKeyword === '' ||
        m.title.includes(searchKeyword) ||
        m.summary.includes(searchKeyword) ||
        m.category.includes(searchKeyword);
      const matchScene = selectedScene === 'all' || m.scene === selectedScene;
      const matchQuality = selectedQuality === 'all' || m.quality === selectedQuality;
      return matchKeyword && matchScene && matchQuality;
    });
  }, [searchKeyword, selectedScene, selectedQuality]);

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

  return (
    <ScrollView className={styles.pageContainer} scrollY>
      <View className={styles.headerSection}>
        <Text className={styles.pageTitle}>素材库</Text>
        <Text className={styles.pageSubtitle}>学习真实通话案例，掌握专业话术技巧</Text>

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
