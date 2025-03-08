const Monster = Vue.component('monster', {
    props: ['name', 'hitpoints', 'proficiency', 'strength', 'dexterity', 'intelligence', 'charisma', 'constitution', 'wisdom', "proficiencies", "expertise", "attacks"],
    data: function(){
        return {
            chatColor: '#' + ((Math.random() * 0xfffff * 1000000).toString(16)).slice(0,6),
            initiative: 0,
            editingHP: false,
            currentHP: this.hitpoints,
            skills: Object.keys(skillsMap),
            rollSkill: Object.keys(skillsMap)[0]
        };
    },
    computed: {
        strengthMod: function() {
            return this.strength >= 10 ? Math.floor((this.strength - 10)/2) : Math.ceil((this.strength - 10)/2);
        },
        dexterityMod: function(){
            return this.dexterity >= 10 ? Math.floor((this.dexterity - 10)/2) : Math.ceil((this.dexterity - 10)/2);
        },
        constitutionMod: function(){
            return this.constitution >= 10 ? Math.floor((this.constitution - 10)/2) : Math.ceil((this.constitution - 10)/2);
        },
        intelligenceMod: function(){
            return this.intelligence >= 10 ? Math.floor((this.intelligence - 10)/2) : Math.ceil((this.intelligence - 10)/2);
        },
        wisdomMod: function(){
            return this.wisdom >= 10 ? Math.floor((this.wisdom - 10)/2) : Math.ceil((this.wisdom - 10)/2);
        },
        charismaMod: function(){
            return this.charisma >= 10 ? Math.floor((this.charisma - 10)/2) : Math.ceil((this.charisma - 10)/2);
        },
        strengthDisplayMod: function(){
            return (this.strength >= 10 ? "+" : "") + this.strengthMod;
        },
        dexterityDisplayMod: function(){
            return (this.dexterity >= 10 ? "+" : "") + this.dexterityMod;
        },
        constitutionDisplayMod: function(){
            return (this.constitution >= 10 ? "+" : "") + this.constitutionMod;
        },
        intelligenceDisplayMod: function(){
            return (this.intelligence >= 10 ? "+" : "") + this.intelligenceMod;
        },
        wisdomDisplayMod: function(){
            return (this.wisdom >= 10 ? "+" : "") + this.wisdomMod;
        },
        charismaDisplayMod: function(){
            return (this.charisma >= 10 ? "+" : "") + this.charismaMod;
        },
        rollSkillMod: function(){
            var prop = skillsMap[this.rollSkill];
            var proficient = this.proficiencies.indexOf(this.rollSkill) >= 0;
            var expert = !proficient && this.expertise.indexOf(this.rollSkill) >= 0;
            var modifier = this.calculateModifier(prop, proficient, expert);
            return (modifier >= 0 ? "+" : "") + modifier;
        },
        attackNames: function() {
            var names = [];
            for(let i = 0; i < this.attacks.length; i++) {
                names.push(this.attacks[i].name);
            }
            return names.join(", ");
        }
    },
    methods: {
        calculateModifier: function(prop, proficient, expert) {
            var modifier = this[prop + 'Mod'];
            if (expert) modifier += this.proficiency * 2;
            else if (proficient) modifier += parseInt(this.proficiency);
            return modifier;
        },
        roll: function(prop, proficient = false, expert = false){
            var d20Roll = Math.floor((Math.random() * 20) + 1); 
            propDisplay = prop;
            if (prop == "initiative") { 
                prop = 'dexterity'; 
            } else if (this.skills.indexOf(prop) >= 0 ){
                prop = skillsMap[this.rollSkill];
            }
            modifier = this.calculateModifier(prop, proficient, expert);
            var rollResult = d20Roll + modifier;
            var newRoll = {
                monsterName: this.name, 
                rollStat: propDisplay,
                displayTime: Date.now(), 
                dice: d20Roll, 
                mods: modifier,
                result: rollResult,
                chatColor: this.chatColor
            };
            this.$parent.addRoll(newRoll);
            return newRoll;
        },
        rollInitiative: function(){
            var rollData = this.roll('initiative');
            this.initiative = rollData.result;
            return true;
        },
        deleteMonster: function(){
            this.$destroy();
            this.$el.parentNode.removeChild(this.$el);
            return true;
        },
        editHP: function(){
            this.editingHP = true;
        },
        saveHP: function(){
            this.editingHP = false;
        },
        skillRoll: function() {
            var expert = this.expertise.indexOf(this.rollSkill) >= 0;
            var proficient = !expert && this.proficiencies.indexOf(this.rollSkill) >= 0;
            this.roll(this.rollSkill, proficient, expert);
            return true;
        }
    },
    mounted: function(){
        this.rollInitiative();
        return true;
    },
    template: `<div class="monster">
        <h3>{{name}}</h3>
        <div class="row initiative">
            <div class="col-5">
                HP: <span v-if="editingHP"><input type="number" v-model="currentHP" :max="hitpoints" @blur="saveHP()"/>
                </span><span @click="editHP()" v-else>{{currentHP}}/{{hitpoints}}</span>
            </div>
            <div class="col-7">
                Initiative: {{initiative}} <button @click="rollInitiative()">&#9850;</button>
            </div>
        </div>
        <div class="row">
            <div class="col-sm">
                STR: <button @click="roll('strength')">{{strengthDisplayMod}}</button><br/>
                ({{strength}}) 
            </div>
            <div class="col-sm">
                DEX: <button @click="roll('dexterity')">{{dexterityDisplayMod}}</button><br/> 
                ({{dexterity}}) 
            </div>
            <div class="col-sm">
                CON: <button @click="roll('constitution')">{{constitutionDisplayMod}}</button><br/>
                ({{constitution}})
            </div>
        </div>
        <div class="row">
            <div class="col-sm">
                INT: <button @click="roll('intelligence')">{{intelligenceDisplayMod}}</button><br/>
                ({{intelligence}})
            </div>
            <div class="col-sm">
                WIS: <button @click="roll('wisdom')">{{wisdomDisplayMod}}</button><br/>
                ({{wisdom}})
            </div>
            <div class="col-sm">
                CHA: <button @click="roll('charisma')">{{charismaDisplayMod}}</button><br/>
                ({{charisma}})
            </div>
        </div>
        <div class="row">
            <div class="col">
                Proficiency bonus: {{proficiency}}
            </div>
        </div>
        <div class="row">
            <div class="col">
                Skill roll:
                <select v-model="rollSkill">
                    <option v-for="skill in skills" v-bind:value="skill">{{skill}}<span v-if="proficiencies.indexOf(skill) >= 0"">*</span><span v-if="expertise.indexOf(skill) >= 0"">**</span></option>
                </select>
                <button @click.prevent="skillRoll()">{{rollSkillMod}}</button>
            </div>
        </div>
        <div class="row">
            <div class="col">
                Attacks: {{attackNames}}
            </div>
        </div>
        <div class="control"><button class="del" @click="deleteMonster()">&minus;</button></div>
    </div>`
});
