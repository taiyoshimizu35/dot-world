export const PartyMemberData2 = {
    // 固定メンバー (ヒロイン/真の魔王)
    'lulusia': {
        id: 'lulusia',
        name: 'ルルシア',
        job: '謎の少女', // 実は魔王
        img: 'lulusia',
        profile: '魔王城で勇者を助けた謎の女性。清楚で可憐な振る舞いをするが、どこかミステリアス。',
        hp: 120, maxHp: 120,
        sp: 200, maxSp: 200,
        atk: 5, def: 8,
        matk: 25, mdef: 20,
        agi: 10,
        growthType: 'mage', // 魔法特化
        initialSkills: ['dark_blast'], // 戦闘魔法のみ
        fixed: true, // パーティから外せない
        joinCondition: { type: 'auto' },
        messages: {
            join: '「あのままでは危ないところでした！私もお供します、怪我の手当てくらいならできますから…」',
            leave: '「……。（離れるわけにはいかない）」' // 通常は呼ばれない
        }
    },

    // 関係者1: 竜族 (東エリア) - 姉(Loop1 Dragon)を探している
    'rin': {
        id: 'rin',
        name: 'リン',
        job: '竜族の戦士',
        img: 'rin',
        profile: '行方不明の姉を探して旅をする竜族の少女。勇者の雰囲気に懐かしさを感じている。',
        hp: 180, maxHp: 180,
        sp: 30, maxSp: 30,
        atk: 22, def: 18,
        matk: 5, mdef: 12,
        agi: 10,
        growthType: 'warrior', // 高ステータス
        initialSkills: ['dragon_claw'], // 強力な物理
        joinCondition: { type: 'auto' }, // 竜族の妹。姉の面影を感じてすぐ加入する
        messages: {
            join: '「貴方の匂い…どこかで。姉さんの手掛かりを知っているの？ ついていくわ。」',
            leave: '「姉さんの情報を探してくる。」'
        }
    },

    // 関係者2: 魔術師 (西エリア) - 勇者の元仲間(Mage)の子孫
    'elena': {
        id: 'elena',
        name: 'エレナ',
        job: '魔術師',
        img: 'elena',
        profile: 'かつての勇者の仲間の血を引く魔術師。攻撃魔法の才能が枯渇しており、回復魔法しか使えないことにコンプレックスを持つ。',
        hp: 90, maxHp: 90,
        sp: 120, maxSp: 120,
        atk: 6, def: 8,
        matk: 15, mdef: 18,
        agi: 9,
        growthType: 'cleric', // 回復特化
        initialSkills: ['heal', 'cure'], // 回復魔法のみ
        joinCondition: { type: 'auto' },
        messages: {
            join: '「私、ご先祖様みたいな凄い魔法は使えないけど…回復なら任せてください。」',
            leave: '「もっと修行しなきゃ…ごめんなさい。」'
        }
    },

    // 関係者3: 剣士 (南エリア) - 勇者の元仲間(Knight?)の子孫
    'aldo': {
        id: 'aldo',
        name: 'アルド',
        job: '剣士',
        img: 'aldo',
        profile: '勇者の伝説に憧れる若き剣士。我流の剣技だが、筋が良い。',
        hp: 150, maxHp: 150,
        sp: 20, maxSp: 20,
        atk: 18, def: 14,
        matk: 4, mdef: 8,
        agi: 12,
        growthType: 'warrior', // バランス型
        initialSkills: ['slash'],
        joinCondition: { type: 'auto' },
        messages: {
            join: '「あんた、ただ者じゃないな！ 俺に剣を教えてくれよ！」',
            leave: '「俺の剣じゃ、まだ足手まといか…」'
        }
    },

    // ---------------------------------------------
    // その他の仲間候補 (ユニーク能力持ち)
    // ---------------------------------------------

    // 荷物持ち (東)
    'george': {
        id: 'george',
        name: 'ジョージ',
        job: '荷物持ち',
        img: 'george',
        profile: '力持ちの心優しい大男。戦いは苦手だが、荷物をたくさん持てる。',
        hp: 200, maxHp: 200,
        sp: 0, maxSp: 0,
        atk: 10, def: 10,
        matk: 0, mdef: 0,
        agi: 5,
        growthType: 'tank', // HP高いだけ
        initialSkills: [], // スキルなし？あるいは「荷物を投げる」？
        passive: 'inventory_expand', // インベントリ拡張
        joinCondition: { type: 'gold', value: 100 }, // 雇う？
        messages: {
            join: '「荷物なら任せてくれ！ 力仕事は得意なんだ。」',
            leave: '「また呼んでくれよな！」'
        }
    },

    // 盗賊 (東)
    'shera': {
        id: 'shera',
        name: 'シェラ',
        job: '盗賊',
        img: 'shera',
        profile: 'スラム育ちの盗賊。目にも止まらぬ早業で、先手を取るのが得意。',
        hp: 100, maxHp: 100,
        sp: 40, maxSp: 40,
        atk: 14, def: 8,
        matk: 8, mdef: 8,
        agi: 30, // 非常に高い
        growthType: 'thief',
        initialSkills: ['mug'], // 盗む攻撃
        passive: 'trap_master', // 罠解除、先制攻撃
        joinCondition: { type: 'auto' }, // 腕利きのスリ。面白そうだからと加入
        messages: {
            join: '「あたしと組む？ 悪い話じゃないね。分け前は弾んでよ？」',
            leave: '「あばよ！ お宝は山分けだ。」'
        }
    },

    // 成金 (西)
    'gordon': {
        id: 'gordon',
        name: 'ゴルドン',
        job: '商人',
        img: 'gordon',
        profile: '金にうるさい商人。戦闘能力は皆無だが、コネを使って安く買い叩く。',
        hp: 80, maxHp: 80,
        sp: 10, maxSp: 10,
        atk: 5, def: 5,
        matk: 5, mdef: 5,
        agi: 8,
        growthType: 'special',
        initialSkills: ['bribe'], // 賄賂（敵を帰らせる？）
        passive: 'merchant_perk', // 売買有利
        joinCondition: { type: 'gold', value: 1000 },
        messages: {
            join: '「ほう、私を護衛につけるとは。……まあ、商売の邪魔をしないならついていこう。」',
            leave: '「時間は金なりだ。失礼するよ。」'
        }
    },

    // 守護者 (西)
    'gawain': {
        id: 'gawain',
        name: 'ガウェイン',
        job: '重装騎士',
        img: 'gawain',
        profile: '主を失った老騎士。最期まで誰かを守り抜くことを望んでいる。',
        hp: 180, maxHp: 180,
        sp: 20, maxSp: 20,
        atk: 14, def: 25,
        matk: 0, mdef: 15,
        agi: 4,
        growthType: 'tank',
        initialSkills: ['cover', 'shield_bash'], // デコイ、防御攻撃
        passive: 'party_def_up', // パッシブで防御微増？
        joinCondition: { type: 'auto' },
        messages: {
            join: '「老骨ですが、盾くらいにはなりましょう。我が剣、貴方に捧げます。」',
            leave: '「ご武運を……。」'
        }
    },

    // 禁術師 (南)
    'sophina': {
        id: 'sophina',
        name: 'ソフィーナ',
        job: '禁術師',
        img: 'sophina',
        profile: '禁忌の魔法に手を染めた魔女。味方を強化し、敵を弱体化させるスペシャリスト。',
        hp: 90, maxHp: 90,
        sp: 100, maxSp: 100,
        atk: 8, def: 8,
        matk: 18, mdef: 22,
        agi: 10,
        growthType: 'debuffer',
        initialSkills: ['curse', 'blood_pact'], // デバフ、強化
        joinCondition: { type: 'auto' },
        messages: {
            join: '「ククク……私の実験に付き合ってくれるのかしら？ いいわよ。」',
            leave: '「興味が尽きたわ。」'
        }
    },

    // 時魔導士 (南)
    'kron': {
        id: 'kron',
        name: 'クロン',
        job: '時魔導士',
        img: 'kron',
        profile: '時間を操る不思議な少女。常に眠そうにしている。',
        hp: 85, maxHp: 85,
        sp: 150, maxSp: 150,
        atk: 6, def: 6,
        matk: 22, mdef: 20,
        agi: 14,
        growthType: 'special',
        initialSkills: ['slow', 'haste'], // 時間操作
        joinCondition: { type: 'auto' },
        messages: {
            join: '「……ふわぁ。あなたと行くと、面白い未来が見えそう。」',
            leave: '「……おやすみ。」'
        }
    }
};
