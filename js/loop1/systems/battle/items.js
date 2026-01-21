// ===========================================
// 戦闘アイテムシステム
// ===========================================
const BattleItems = {
    updateItem(battle) {
        const items = Inv.list();
        if (items.length === 0) {
            battle.msg = 'アイテムがない！';
            battle.msgTimer = 0;
            battle.waitForInput = true;
            battle.phase = 'wait_input';
            battle.nextPhase = 'command';
            return;
        }

        if (Input.justPressed('ArrowUp')) battle.itemCur = (battle.itemCur - 1 + items.length) % items.length;
        if (Input.justPressed('ArrowDown')) battle.itemCur = (battle.itemCur + 1) % items.length;

        if (Input.interact()) {
            const [name] = items[battle.itemCur];
            let used = true;

            if (name === '薬草') { Inv.remove('薬草'); PlayerStats.heal(15); battle.msg = '薬草を使用！HP+15！'; }
            else if (name === 'ポーション') { Inv.remove('ポーション'); PlayerStats.heal(30); battle.msg = 'ポーション使用！HP+30！'; }
            else if (name === '上薬草') { Inv.remove('上薬草'); PlayerStats.heal(60); battle.msg = '上薬草を使用！HP+60！'; }
            else if (name === 'エリクサー') { Inv.remove('エリクサー'); PlayerStats.heal(100); battle.msg = 'エリクサー使用！HP+100！'; }
            else if (name === '魔力の小瓶') { Inv.remove('魔力の小瓶'); PlayerStats.healMp(10); battle.msg = '魔力の小瓶を使用！MP+10！'; }
            else if (name === 'ハイ・エーテル') { Inv.remove('ハイ・エーテル'); PlayerStats.healMp(30); battle.msg = 'ハイ・エーテル使用！MP+30！'; }
            else if (name === '解毒ポーション') {
                Inv.remove('解毒ポーション');
                if (PlayerStats.status.poisonVal > 0) { PlayerStats.status.poisonVal = 0; battle.msg = '毒が消えた！'; }
                else battle.msg = '使っても効果がない！';
            }
            else if (name === '気付け薬') {
                Inv.remove('気付け薬');
                if (PlayerStats.status.silence > 0) { PlayerStats.status.silence = 0; battle.msg = '沈黙が治った！'; }
                else battle.msg = '使っても効果がない！';
            }
            else if (name === '力の粉') {
                Inv.remove('力の粉');
                if (PlayerStats.status.atkDownVal > 0) {
                    PlayerStats.atk += PlayerStats.status.atkDownVal;
                    PlayerStats.status.atkDownVal = 0;
                    battle.msg = '攻撃力が元に戻った！';
                } else battle.msg = '使っても効果がない！';
            }
            else if (name === '守りの霧') {
                Inv.remove('守りの霧');
                if (PlayerStats.status.defDownVal > 0) {
                    PlayerStats.def += PlayerStats.status.defDownVal;
                    PlayerStats.status.defDownVal = 0;
                    battle.msg = '防御力が元に戻った！';
                } else battle.msg = '使っても効果がない！';
            }
            else {
                battle.msg = '使えないアイテム！';
                battle.phase = 'wait_input';
                battle.msgTimer = 0;
                battle.waitForInput = true;
                battle.nextPhase = 'command';
                return;
            }

            battle.msgTimer = 0;
            battle.waitForInput = true;
            battle.phase = 'wait_input';
            battle.nextPhase = 'enemyAttack';
            PlayerStats.isDefending = false;
        }
        if (Input.cancel()) battle.phase = 'command';
    }
};