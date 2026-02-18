export const PartyMemberData2 = {
    // 1. 戦士 (物理アタッカー)
    'warrior': {
        id: 'warrior',
        name: 'アルド',
        job: '傭兵',
        profile: 'かつて王国軍に所属していた剣の腕立つ傭兵。金で動くが、信義には厚い。',
        hp: 150, maxHp: 150,
        sp: 20, maxSp: 20,
        atk: 18, def: 12,
        matk: 5, mdef: 8,
        agi: 10,
        growthType: 'warrior', // 成長タイプ
        initialSkills: ['slash'], // 将来用: 初期スキルID
        joinCondition: { type: 'gold', value: 500 }, // 将来用: 加入条件
        messages: {
            join: '「雇い主はお前か？ いいだろう、背中は任せな。」',
            leave: '「契約終了だな。また縁があったら頼むぜ。」'
        }
    },

    // 2. 魔導士 (魔法アタッカー)
    'mage': {
        id: 'mage',
        name: 'エレナ',
        job: '魔導士',
        profile: '古代語魔法を研究する学者。知識欲が旺盛で、未知の遺跡に興味を持つ。',
        hp: 80, maxHp: 80,
        sp: 100, maxSp: 100,
        atk: 5, def: 8,
        matk: 25, mdef: 20,
        agi: 12,
        growthType: 'mage',
        initialSkills: ['fireball'],
        joinCondition: { type: 'item', value: 'ancient_book' },
        messages: {
            join: '「貴方の旅、興味深いわね。同行させてもらうわ。」',
            leave: '「十分なデータは取れたわ。それじゃ。」'
        }
    },

    // 3. 僧侶 (ヒーラー)
    'cleric': {
        id: 'cleric',
        name: 'ミリア',
        job: '聖職者',
        profile: '怪我人を放っておけない心優しいシスター。戦いは好まないが、護るための力を行使する。',
        hp: 100, maxHp: 100,
        sp: 120, maxSp: 120,
        atk: 8, def: 10,
        matk: 15, mdef: 25,
        agi: 8,
        growthType: 'cleric',
        initialSkills: ['heal', 'cure'],
        joinCondition: { type: 'event', value: 'church_donation' },
        messages: {
            join: '「神のご加護がありますように。私もお手伝いします。」',
            leave: '「教会に戻らなくてはなりません。お元気で。」'
        }
    },

    // 4. 盗賊 (素早さ・アイテム)
    'thief': {
        id: 'thief',
        name: 'ジグ',
        job: '盗賊',
        profile: 'スラム街出身の軽薄な男。手先が器用で、鍵開けや罠の解除が得意。',
        hp: 110, maxHp: 110,
        sp: 40, maxSp: 40,
        atk: 14, def: 9,
        matk: 8, mdef: 8,
        agi: 20,
        growthType: 'thief',
        initialSkills: ['steal'],
        joinCondition: { type: 'event', value: 'thieves_guild' },
        messages: {
            join: '「へっ、面白そうなことやってんじゃん。俺も混ぜろよ。」',
            leave: '「じゃあな、あばよ！」'
        }
    },

    // 5. 重戦士 (タンク)
    'tank': {
        id: 'tank',
        name: 'ガルド',
        job: '重装兵',
        profile: '全身を厚い鎧で包んだ大男。その巨体は動く城壁のよう。',
        hp: 200, maxHp: 200,
        sp: 10, maxSp: 10,
        atk: 12, def: 25,
        matk: 0, mdef: 15,
        agi: 5,
        growthType: 'tank',
        initialSkills: ['guard'],
        joinCondition: { type: 'event', value: 'colosseum_win' },
        messages: {
            join: '「俺の盾が必要か？ ...いいだろう、共に往く。」',
            leave: '「任務完了だ。」'
        }
    },

    // 6. 吟遊詩人 (バッファー)
    'bard': {
        id: 'bard',
        name: 'ルル',
        job: '吟遊詩人',
        profile: '世界中を旅して歌を歌う旅人。その歌声は仲間の士気を高める。',
        hp: 90, maxHp: 90,
        sp: 80, maxSp: 80,
        atk: 10, def: 10,
        matk: 18, mdef: 18,
        agi: 14,
        growthType: 'support',
        initialSkills: ['song_of_courage'],
        joinCondition: { type: 'event', value: 'pub_performance' },
        messages: {
            join: '「君たちの冒険、素敵な詩になりそうね！」',
            leave: '「新しい歌を探しに行くね。バイバイ！」'
        }
    },

    // 7. 狩人 (遠距離・クリティカル)
    'ranger': {
        id: 'ranger',
        name: 'ホーク',
        job: '狩人',
        profile: '森で暮らす寡黙な弓使い。百発百中の腕前を持つ。',
        hp: 110, maxHp: 110,
        sp: 30, maxSp: 30,
        atk: 16, def: 10,
        matk: 5, mdef: 10,
        agi: 16,
        growthType: 'physical_dex',
        initialSkills: ['aimed_shot'],
        joinCondition: { type: 'event', value: 'forest_encounter' },
        messages: {
            join: '「...ついていく。森の外にも獲物はいる。」',
            leave: '「森へ帰る。」'
        }
    },

    // 8. 武闘家 (高HP・連撃)
    'monk': {
        id: 'monk',
        name: 'リン',
        job: '武闘家',
        profile: '東方の国から来た修行僧。己の肉体のみを武器とする。',
        hp: 160, maxHp: 160,
        sp: 40, maxSp: 40,
        atk: 13, def: 11,
        matk: 10, mdef: 10,
        agi: 15,
        growthType: 'monk',
        initialSkills: ['double_punch'],
        joinCondition: { type: 'level', value: 10 },
        messages: {
            join: '「修行の道も一歩から。同行させていただけますか？」',
            leave: '「更なる高みを目指して参ります。」'
        }
    },

    // 9. 錬金術師 (特殊・アイテム)
    'alchemist': {
        id: 'alchemist',
        name: 'ネロ',
        job: '錬金術師',
        profile: '怪しげな薬を調合する錬金術師。マッドサイエンティスト気味。',
        hp: 90, maxHp: 90,
        sp: 70, maxSp: 70,
        atk: 6, def: 7,
        matk: 20, mdef: 15,
        agi: 11,
        growthType: 'special',
        initialSkills: ['poison_flask'],
        joinCondition: { type: 'item', value: 'rare_herb' },
        messages: {
            join: '「ヒヒッ、君実験台に良さそうだねぇ。ついてってあげるよ。」',
            leave: '「材料切れだ。補充してくるよ。」'
        }
    }
};
