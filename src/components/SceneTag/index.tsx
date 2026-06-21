import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import type { SceneType } from '@/types';
import { getSceneLabel, getSceneColor } from '@/utils';
import styles from './index.module.scss';

interface SceneTagProps {
  scene: SceneType;
  size?: 'sm' | 'md';
  className?: string;
}

const SceneTag: React.FC<SceneTagProps> = ({ scene, size = 'md', className }) => {
  const label = getSceneLabel(scene);
  const color = getSceneColor(scene);

  return (
    <View
      className={classnames(styles.sceneTag, styles[size], className)}
      style={{ backgroundColor: `${color}15`, color }}
    >
      <Text className={styles.tagText}>{label}</Text>
    </View>
  );
};

export default SceneTag;
