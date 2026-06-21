import type { PracticeQuestion, SceneType } from '@/types';

const practiceQuestions: PracticeQuestion[] = [
  {
    id: 'q1',
    scene: 'opening',
    customerContent: '你好，我想咨询一下车险理赔的事情。',
    options: [
      {
        id: 'q1-a',
        content: '您好，这里是XX保险公司。请问您的姓名和保单号是？',
        isCorrect: true
      },
      {
        id: 'q1-b',
        content: '车险理赔啊，那你直接打理赔专线吧。',
        isCorrect: false
      },
      {
        id: 'q1-c',
        content: '等一下，我先看看怎么操作。',
        isCorrect: false
      },
      {
        id: 'q1-d',
        content: '车险理赔有什么问题吗？',
        isCorrect: false
      }
    ],
    agentAnswer: '您好，这里是XX保险公司客服中心，我是客服专员小A。为了更好地为您服务，请先跟我确认一下您的姓名和保单号可以吗？',
    qualityReview: '优秀的开场应该包含：问候+身份确认+主动提供帮助+确认客户信息。选项A虽然简洁，但缺少了自我介绍和主动提供帮助的环节，需要更加完整和专业。',
    recommendedScript: '您好，这里是XX保险公司客服中心，我是客服专员小A，很高兴为您服务。请问您贵姓？方便提供一下您的保单号吗？我来帮您查询理赔相关信息。',
    errorType: '开场不完整',
    explanation: '开场确认是建立信任的第一步，完整的开场应该包含：1) 问候语 2) 公司和个人身份介绍 3) 表达服务意愿 4) 确认客户身份信息。这样可以让客户感受到专业和尊重。'
  },
  {
    id: 'q2',
    scene: 'comfort',
    customerContent: '你们什么效率啊！我上周就提交了理赔申请，到现在都没人联系我！我要投诉！',
    options: [
      {
        id: 'q2-a',
        content: '投诉的话请拨打投诉热线，我这边是咨询热线。',
        isCorrect: false
      },
      {
        id: 'q2-b',
        content: '非常抱歉让您久等了！我完全理解您现在的心情，遇到这种情况确实让人很生气。您先消消气，我马上帮您查询处理进度，一定给您一个满意的答复。',
        isCorrect: true
      },
      {
        id: 'q2-c',
        content: '不可能吧，我们一般3天内就会联系的。',
        isCorrect: false
      },
      {
        id: 'q2-d',
        content: '您别急，我帮您看看。',
        isCorrect: false
      }
    ],
    agentAnswer: '非常抱歉让您这么生气，我完全理解您的心情，换作是我遇到这种情况也会很着急的。您先消消气，我这边马上为您查询，看看具体是什么情况，一定给您一个满意的答复。',
    qualityReview: '当客户情绪激动时，首先要做的是安抚情绪，而不是辩解或推卸责任。正确选项B做到了：1) 诚恳道歉 2) 表达共情 3) 承诺解决。这是处理投诉的标准流程。',
    recommendedScript: '非常抱歉让您有这么不好的体验！我完全理解您现在的感受，等了这么久确实让人很沮丧。您先别着急，我现在就帮您查询一下具体情况，看看问题出在哪里，然后马上帮您推进处理，好吗？',
    errorType: '情绪安抚不当',
    explanation: '情绪安抚的关键技巧：1) 先处理情绪，再处理问题 2) 使用共情话术（我理解您的感受）3) 诚恳道歉，不要辩解 4) 给出明确的解决承诺和时间预期。'
  },
  {
    id: 'q3',
    scene: 'clarify',
    customerContent: '我收到的商品有质量问题，我要退货。',
    options: [
      {
        id: 'q3-a',
        content: '好的，那您寄回来吧。',
        isCorrect: false
      },
      {
        id: 'q3-b',
        content: '请问具体是什么质量问题呢？方便提供一下照片吗？另外请告诉我您的订单号，我帮您确认一下是否在退换货有效期内。',
        isCorrect: true
      },
      {
        id: 'q3-c',
        content: '质量问题？不可能吧，我们的商品都是经过质检的。',
        isCorrect: false
      },
      {
        id: 'q3-d',
        content: '退货的话邮费需要您自己承担哦。',
        isCorrect: false
      }
    ],
    agentAnswer: '非常抱歉给您带来不好的体验。为了更好地帮您处理退货，请您先告诉我一下：1) 具体是什么质量问题 2) 方便的话可以提供一下问题照片 3) 您的订单号是多少呢？我帮您确认一下订单状态。',
    qualityReview: '需求澄清的关键是收集足够的信息以便高效处理问题。正确选项B完整询问了问题细节、证据和订单信息，避免了后续反复沟通。',
    recommendedScript: '非常抱歉让您收到了有问题的商品，这确实是我们的疏忽。为了尽快帮您处理退货，麻烦您提供一下：订单号、具体的质量问题描述，以及问题部位的照片，这样我可以马上为您安排退货流程。',
    errorType: '需求澄清不充分',
    explanation: '需求澄清的目的是一次性收集所有必要信息，避免反复沟通降低效率。需要确认的信息包括：订单信息、问题详情、相关证据、客户诉求等。使用封闭式问题确认，开放式问题补充细节。'
  },
  {
    id: 'q4',
    scene: 'closing',
    customerContent: '好的，问题解决了，谢谢。',
    options: [
      {
        id: 'q4-a',
        content: '不客气，再见。',
        isCorrect: false
      },
      {
        id: 'q4-b',
        content: '不客气。请问还有其他可以帮到您的吗？如果没有的话，耽误您几秒钟做个服务评价可以吗？感谢您的来电，祝您生活愉快！',
        isCorrect: true
      },
      {
        id: 'q4-c',
        content: '好的，记得给个好评哦。',
        isCorrect: false
      },
      {
        id: 'q4-d',
        content: '没问题就好，挂了。',
        isCorrect: false
      }
    ],
    agentAnswer: '不客气，很高兴能帮到您。请问还有其他问题需要咨询吗？如果没有的话，耽误您几秒钟时间，对我的服务做个评价可以吗？您的反馈对我们很重要。感谢您的来电，祝您生活愉快，再见！',
    qualityReview: '结束确认是完整服务体验的最后一环。正确选项B做到了：1) 确认是否还有其他需求 2) 引导服务评价 3) 礼貌告别。这体现了服务的专业性和完整性。',
    recommendedScript: '不客气，能帮您解决问题我也很高兴。请问还有其他可以帮到您的吗？如果没有的话，稍后会有一条服务评价短信发送给您，麻烦您对我的服务做个评价，您的反馈对我们提升服务质量很重要。再次感谢您的来电，祝您生活愉快，再见！',
    errorType: '结束流程不完整',
    explanation: '完整的结束确认应包含：1) 确认问题已解决 2) 询问是否还有其他需求 3) 引导满意度评价 4) 表达感谢和祝福 5) 礼貌结束。这不仅是专业体现，也是收集客户反馈的重要时机。'
  },
  {
    id: 'q5',
    scene: 'comfort',
    customerContent: '我已经跟你们说过三遍了！每次都说会处理，结果每次都没下文！你们到底能不能办事？',
    options: [
      {
        id: 'q5-a',
        content: '您别激动，我帮您查一下。',
        isCorrect: false
      },
      {
        id: 'q5-b',
        content: '真的非常抱歉让您反复沟通！我能感受到您现在有多失望和生气，这确实是我们做得不好。这次我亲自跟进您的问题，30分钟内给您回电，直到问题解决为止，您看可以吗？',
        isCorrect: true
      },
      {
        id: 'q5-c',
        content: '之前的同事怎么跟您说的？',
        isCorrect: false
      },
      {
        id: 'q5-d',
        content: '您别急，处理需要时间的。',
        isCorrect: false
      }
    ],
    agentAnswer: '真的非常抱歉让您这么失望，让您反复沟通却没有得到解决，这是我们工作的严重失误。我完全理解您现在愤怒的心情。这次我向您保证，我会亲自跟进您的问题，每一步进展都及时通知您，30分钟内给您第一个回复，直到问题彻底解决，您看这样可以吗？',
    qualityReview: '面对重复投诉的客户，需要表现出更强的共情和更具体的承诺。正确选项B不仅诚恳道歉，还给出了具体的跟进人和时间承诺，让客户感受到被重视。',
    recommendedScript: '真的非常抱歉让您经历这么不好的服务体验，让您反复沟通却没有结果，这是我们的严重失职。我能感受到您有多失望和愤怒，换作是我也会很生气。这次我向您郑重承诺：由我亲自全程跟进您的问题，30分钟内给您第一个进展回复，直到问题彻底解决。请您放心，这次一定给您一个满意的答复。',
    errorType: '情绪安抚不足',
    explanation: '处理重复投诉的要点：1) 承认之前的失误，不要辩解 2) 表达更深层次的共情 3) 给出具体、可落地的解决方案和时间承诺 4) 提供专属跟进人，让客户有依靠。'
  },
  {
    id: 'q6',
    scene: 'opening',
    customerContent: '喂，是客服吗？',
    options: [
      {
        id: 'q6-a',
        content: '是的，请问有什么事？',
        isCorrect: false
      },
      {
        id: 'q6-b',
        content: '您好！这里是XX客服中心，我是客服专员小A，很高兴为您服务。请问有什么可以帮助您的？',
        isCorrect: true
      },
      {
        id: 'q6-c',
        content: '对，您说。',
        isCorrect: false
      },
      {
        id: 'q6-d',
        content: '您好，请问您是哪位？',
        isCorrect: false
      }
    ],
    agentAnswer: '您好！这里是XX客服中心，我是您的专属客服小A，很高兴为您服务。请问您今天来电是有什么问题需要咨询或者解决吗？',
    qualityReview: '开场白是给客户的第一印象，专业的开场白能快速建立信任感。选项B包含了所有必要元素：问候、公司身份、个人身份、服务意愿。',
    recommendedScript: '您好，欢迎致电XX客服中心！我是客服专员小A，很高兴为您服务。请问有什么我可以帮助您的吗？',
    errorType: '开场不专业',
    explanation: '专业开场白的标准结构：1) 热情问候 2) 公司名称 3) 个人姓名/工号 4) 表达服务意愿 5) 开放式询问客户需求。语速适中，语气亲切，让客户感受到被重视。'
  }
];

export default practiceQuestions;

export const getTodayQuestions = (): PracticeQuestion[] => {
  return practiceQuestions;
};

export const getQuestionById = (id: string): PracticeQuestion | undefined => {
  return practiceQuestions.find(q => q.id === id);
};

export const getQuestionsByScene = (scene: SceneType): PracticeQuestion[] => {
  return practiceQuestions.filter(q => q.scene === scene);
};
