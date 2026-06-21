import type { Material, SceneType } from '@/types';

const categories = ['保险理赔', '电商售后', '在线教育', '银行服务', '医疗咨询'];

const generateDialogue = (scene: SceneType) => {
  const dialogues: Record<SceneType, Array<{ speaker: 'customer' | 'agent'; content: string }>> = {
    opening: [
      { speaker: 'agent', content: '您好，这里是XX客服中心，我是客服专员小A，请问有什么可以帮助您的？' },
      { speaker: 'customer', content: '你好，我想咨询一下我昨天申请的理赔什么时候能处理好？' },
      { speaker: 'agent', content: '好的先生，为了更好地为您服务，请先确认一下您的姓名和保单号可以吗？' }
    ],
    clarify: [
      { speaker: 'customer', content: '我这个订单已经退货了，为什么退款还没到账？' },
      { speaker: 'agent', content: '非常抱歉给您带来不便，请问您的订单号是多少呢？我帮您查询一下。' },
      { speaker: 'customer', content: '订单号是20260615001，我上周六就寄回去了。' },
      { speaker: 'agent', content: '好的，我帮您查看一下。请问您退回的商品是否保持原包装，有没有损坏呢？另外麻烦您提供一下退货的快递单号，我帮您确认物流状态。' }
    ],
    comfort: [
      { speaker: 'customer', content: '你们怎么回事啊！我已经等了一个星期了，问题还没解决！我要投诉！' },
      { speaker: 'agent', content: '非常抱歉让您这么生气，我完全理解您现在的心情，换作是我遇到这种情况也会很着急的。您先消消气，我这边马上为您处理，一定给您一个满意的答复。' },
      { speaker: 'customer', content: '唉，你们每次都这么说，就是不办事。' },
      { speaker: 'agent', content: '真的非常抱歉让您失望了，这次我亲自跟进您的问题，30分钟内给您回电答复，您看可以吗？' }
    ],
    closing: [
      { speaker: 'agent', content: '好的，您的问题我已经记录下来了，我们会在24小时内安排工作人员与您联系处理。' },
      { speaker: 'customer', content: '好的，那我等你们电话。' },
      { speaker: 'agent', content: '请问还有其他可以帮到您的吗？' },
      { speaker: 'customer', content: '没有了，谢谢。' },
      { speaker: 'agent', content: '不客气，感谢您的来电，祝您生活愉快，再见！' }
    ]
  };

  return dialogues[scene].map((item, index) => ({
    id: `${scene}-${index}`,
    ...item,
    timestamp: `00:${String(index * 15).padStart(2, '0')}`
  }));
};

const summaries: Record<SceneType, string[]> = {
  opening: [
    '客户来电咨询理赔进度，坐席主动询问并确认客户身份信息',
    '客户咨询产品使用问题，坐席礼貌问候并确认客户购买信息',
    '客户反映账单问题，坐席主动确认客户账号信息以便查询'
  ],
  clarify: [
    '客户反映退款未到账，坐席主动询问订单号和退货快递单号，确认退货商品状态',
    '客户投诉商品质量问题，坐席询问订单详情、购买时间和具体问题表现',
    '客户咨询服务开通问题，坐席确认客户账号信息和办理渠道'
  ],
  comfort: [
    '客户情绪激动，对处理进度不满，坐席先安抚客户情绪，表示理解并承诺优先处理',
    '客户因多次沟通未果表示愤怒，坐席诚恳道歉并承诺专人跟进',
    '客户投诉服务态度，坐席耐心倾听并表达歉意，及时安抚客户情绪'
  ],
  closing: [
    '问题处理完毕，坐席主动询问客户是否还有其他需求，礼貌结束通话',
    '已记录客户问题并安排后续处理，确认客户无其他需求后礼貌告别',
    '客户咨询完成，坐席进行服务满意度引导，礼貌结束通话'
  ]
};

const titles: Record<SceneType, string[]> = {
  opening: [
    '保险理赔咨询-身份确认篇',
    '产品使用指导-开场确认',
    '账单查询-客户信息核实'
  ],
  clarify: [
    '退款延迟-信息核实流程',
    '质量投诉-问题细节确认',
    '服务开通-办理渠道核实'
  ],
  comfort: [
    '处理超时-情绪安抚应对',
    '重复投诉-耐心安抚技巧',
    '服务态度投诉-道歉与安抚'
  ],
  closing: [
    '理赔受理-确认结束话术',
    '问题记录-服务结束语',
    '咨询完成-满意度引导'
  ]
};

const materials: Material[] = [];
const scenes: SceneType[] = ['opening', 'clarify', 'comfort', 'closing'];

for (let i = 0; i < 12; i++) {
  const sceneIndex = i % 4;
  const scene = scenes[sceneIndex];
  const quality = i % 3 === 0 ? 'failed' : 'excellent';
  const titleIndex = Math.floor(i / 4);

  materials.push({
    id: `mat-${i + 1}`,
    title: titles[scene][titleIndex % titles[scene].length],
    scene,
    quality,
    category: categories[i % categories.length],
    duration: 60 + Math.floor(Math.random() * 180),
    date: `2026-0${(i % 6) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
    summary: summaries[scene][titleIndex % summaries[scene].length],
    dialogue: generateDialogue(scene),
    tags: [scene, quality === 'excellent' ? '优秀案例' : '待改进', categories[i % categories.length]]
  });
}

export default materials;
