import type { MistakeRecord, SceneType } from '@/types';

const mistakeRecords: MistakeRecord[] = [
  {
    id: 'm1',
    questionId: 'q1',
    scene: 'opening',
    customerContent: '你好，我想咨询一下车险理赔的事情。',
    selectedOption: '车险理赔啊，那你直接打理赔专线吧。',
    correctAnswer: '您好，这里是XX保险公司客服中心，我是客服专员小A。为了更好地为您服务，请先跟我确认一下您的姓名和保单号可以吗？',
    errorType: '开场不完整',
    agentAnswer: '您好，这里是XX保险公司客服中心，我是客服专员小A。为了更好地为您服务，请先跟我确认一下您的姓名和保单号可以吗？',
    qualityReview: '作为客服，应该主动承担起帮助客户解决问题，而不是简单地将客户推给其他部门。正确的做法是先确认客户信息，主动帮客户查询，而不是让客户自己再打电话。',
    recommendedScript: '您好，这里是XX保险公司客服中心，我是客服专员小A，很高兴为您服务。请问您贵姓？方便提供一下您的保单号吗？我来帮您查询理赔相关信息。',
    explanation: '开场确认是建立信任的第一步，完整的开场应该包含：1) 问候语 2) 公司和个人身份介绍 3) 表达服务意愿 4) 确认客户身份信息。',
    practiceDate: '2026-06-20',
    reviewCount: 1
  },
  {
    id: 'm2',
    questionId: 'q2',
    scene: 'comfort',
    customerContent: '你们什么效率啊！我上周就提交了理赔申请，到现在都没人联系我！我要投诉！',
    selectedOption: '不可能吧，我们一般3天内就会联系的。',
    correctAnswer: '非常抱歉让您久等了！我完全理解您现在的心情，遇到这种情况确实让人很生气。您先消消气，我马上帮您查询处理进度，一定给您一个满意的答复。',
    errorType: '情绪安抚不当',
    agentAnswer: '非常抱歉让您这么生气，我完全理解您的心情，换作是我遇到这种情况也会很着急的。您先消消气，我这边马上为您查询，看看具体是什么情况，一定给您一个满意的答复。',
    qualityReview: '当客户情绪激动时，最忌讳的就是辩解和否定客户的感受。正确的做法是先共情，认可客户的情绪，然后再给出解决方案。',
    recommendedScript: '非常抱歉让您有这么不好的体验！我完全理解您现在的感受，等了这么久确实让人很沮丧。您先别着急，我现在就帮您查询一下具体情况，看看问题出在哪里，然后马上帮您推进处理，好吗？',
    explanation: '情绪安抚的关键技巧：1) 先处理情绪，再处理问题 2) 使用共情话术（我理解您的感受）3) 诚恳道歉，不要辩解 4) 给出明确的解决承诺和时间预期。',
    practiceDate: '2026-06-19',
    reviewCount: 2
  },
  {
    id: 'm3',
    questionId: 'q3',
    scene: 'clarify',
    customerContent: '我收到的商品有质量问题，我要退货。',
    selectedOption: '好的，那您寄回来吧。',
    correctAnswer: '请问具体是什么质量问题呢？方便提供一下照片吗？另外请告诉我您的订单号，我帮您确认一下是否在退换货有效期内。',
    errorType: '需求澄清不充分',
    agentAnswer: '非常抱歉给您带来不好的体验。为了更好地帮您处理退货，请您先告诉我一下：1) 具体是什么质量问题 2) 方便的话可以提供一下问题照片 3) 您的订单号是多少呢？我帮您确认一下订单状态。',
    qualityReview: '简单同意退货看似爽快，但没有收集必要的信息会导致后续处理效率低下。应该先确认问题细节、订单信息和相关证据，这样才能高效处理退货流程。',
    recommendedScript: '非常抱歉让您收到了有问题的商品，这确实是我们的疏忽。为了尽快帮您处理退货，麻烦您提供一下：订单号、具体的质量问题描述，以及问题部位的照片，这样我可以马上为您安排退货流程。',
    explanation: '需求澄清的目的是一次性收集所有必要信息，避免反复沟通降低效率。需要确认的信息包括：订单信息、问题详情、相关证据、客户诉求等。',
    practiceDate: '2026-06-18',
    reviewCount: 0
  },
  {
    id: 'm4',
    questionId: 'q4',
    scene: 'closing',
    customerContent: '好的，问题解决了，谢谢。',
    selectedOption: '不客气，再见。',
    correctAnswer: '不客气。请问还有其他可以帮到您的吗？如果没有的话，耽误您几秒钟做个服务评价可以吗？感谢您的来电，祝您生活愉快！',
    errorType: '结束流程不完整',
    agentAnswer: '不客气，很高兴能帮到您。请问还有其他问题需要咨询吗？如果没有的话，耽误您几秒钟时间，对我的服务做个评价可以吗？您的反馈对我们很重要。感谢您的来电，祝您生活愉快，再见！',
    qualityReview: '结束通话过于仓促，缺少了确认是否还有其他需求、引导满意度评价等重要环节。完整的结束流程可以提升客户体验，同时收集宝贵的反馈。',
    recommendedScript: '不客气，能帮您解决问题我也很高兴。请问还有其他可以帮到您的吗？如果没有的话，稍后会有一条服务评价短信发送给您，麻烦您对我的服务做个评价，您的反馈对我们提升服务质量很重要。再次感谢您的来电，祝您生活愉快，再见！',
    explanation: '完整的结束确认应包含：1) 确认问题已解决 2) 询问是否还有其他需求 3) 引导满意度评价 4) 表达感谢和祝福 5) 礼貌结束。',
    practiceDate: '2026-06-17',
    reviewCount: 1
  },
  {
    id: 'm5',
    questionId: 'q5',
    scene: 'comfort',
    customerContent: '我已经跟你们说过三遍了！每次都说会处理，结果每次都没下文！你们到底能不能办事？',
    selectedOption: '您别激动，我帮您查一下。',
    correctAnswer: '真的非常抱歉让您反复沟通！我能感受到您现在有多失望和生气，这确实是我们做得不好。这次我亲自跟进您的问题，30分钟内给您回电，直到问题解决为止，您看可以吗？',
    errorType: '情绪安抚不足',
    agentAnswer: '真的非常抱歉让您这么失望，让您反复沟通却没有得到解决，这是我们工作的严重失误。我完全理解您现在愤怒的心情。这次我向您保证，我会亲自跟进您的问题，每一步进展都及时通知您，30分钟内给您第一个回复，直到问题彻底解决，您看这样可以吗？',
    qualityReview: '面对情绪特别激动的客户，简单的安抚是不够的。需要表达更深层次的共情，承认之前的失误，并给出具体的承诺，让客户感受到被重视和改变。',
    recommendedScript: '真的非常抱歉让您经历这么不好的服务体验，让您反复沟通却没有结果，这是我们的严重失职。我能感受到您有多失望和愤怒，换作是我也会很生气。这次我向您郑重承诺：由我亲自全程跟进您的问题，30分钟内给您第一个进展回复，直到问题彻底解决。请您放心，这次一定给您一个满意的答复。',
    explanation: '处理重复投诉的要点：1) 承认之前的失误，不要辩解 2) 表达更深层次的共情 3) 给出具体、可落地的解决方案和时间承诺 4) 提供专属跟进人，让客户有依靠。',
    practiceDate: '2026-06-16',
    reviewCount: 3
  }
];

export default mistakeRecords;

export const getMistakesByScene = (scene?: SceneType): MistakeRecord[] => {
  if (!scene) return mistakeRecords;
  return mistakeRecords.filter(m => m.scene === scene);
};

export const getMistakeById = (id: string): MistakeRecord | undefined => {
  return mistakeRecords.find(m => m.id === id);
};

export const getMistakeStats = () => {
  const stats: Record<SceneType, number> = {
    opening: 0,
    clarify: 0,
    comfort: 0,
    closing: 0
  };
  
  mistakeRecords.forEach(m => {
    stats[m.scene]++;
  });
  
  return stats;
};

export const getErrorTypeStats = () => {
  const stats: Record<string, number> = {};
  mistakeRecords.forEach(m => {
    stats[m.errorType] = (stats[m.errorType] || 0) + 1;
  });
  return stats;
};
