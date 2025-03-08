var skillsMap = {
    "Acrobatics": 'dexterity',
    "Animal Handling": "wisdonm",
    "Arcana": "intelligence",
    "Athletics": "strength",
    "Deception": "charisma",
    "History": "intelligence",
    "Insight": "wisdom",
    "Intimidation": "charisma",
    "Investigation": "intelligence",
    "Medicine": "wisdom",
    "Nature": "intelligence",
    "Perception": "wisdom",
    "Performance": "charisma",
    "Persuasion": "charisma",
    "Religion": "intelligence",
    "Sleight of Hand": "dexterity",
    "Stealth": "dexterity",
    "Survival": "wisdom"
};

var appData = {
    monsters: [],
    rolls: [],
    randomRoll: 0,
    newHP: 1,
    newStrength: 10,
    newDexterity: 10,
    newConstitution: 10,
    newIntelligence: 10,
    newCharisma: 10,
    newWisdom: 10,
    newName: '',
    proficiency: 1,
    skills: Object.keys(skillsMap),
    addingSkill: false,
    newSkillLevel: "proficient",
    newSkill: null,
    proficiencies: [],
    expertise: [],
    attacks: [],
    addingAttack: false,
    newAttackName: '',
    newAttackType: 'ranged',
    newAttackRange: "5",
    newAttackTarget: 1,
    newAttackHit: 1
};

const app = new Vue({
    el: '#app',
    data: appData,
    computed: {
        newStrengthMod: function() {
            return (this.newStrength >= 10 ? "+" : "") + this.newMod(this.newStrength);
        },
        newDexterityMod: function() {
            return (this.newDexterity >= 10 ? "+" : "") + this.newMod(this.newDexterity);
        },
        newConstitutionMod: function() {
            return (this.newConstitution >= 10 ? "+" : "") + this.newMod(this.newConstitution);
        },
        newIntelligenceMod: function() {
            return (this.newIntelligence >= 10 ? "+" : "") + this.newMod(this.newIntelligence);
        },
        newWisdomMod: function() {
            return (this.newWisdom >= 10 ? "+" : "") + this.newMod(this.newWisdom);
        },
        newCharismaMod: function() {
            return (this.newCharisma >= 10 ? "+" : "") + this.newMod(this.newCharisma);
        },
        selectedSkills: function() {
            return this.proficiencies.concat(this.expertise);
        },
        remainingSkills: function() {
            var remaining = [];
            for (let i = 0; i < this.skills.length; i++) {
                var skill = this.skills[i];
                if (this.selectedSkills.indexOf(skill) < 0) remaining.push(skill);
            }
            return remaining;
        }
    },
    methods: {
        newMod: function(propValue) {
            return propValue >= 10 ? Math.floor((propValue - 10)/2) : Math.ceil((propValue - 10)/2);
        },
        refocus: function() {
            document.getElementById("name").focus();
        },
        resetFields: function() {
            this.newName = "";
            this.newHP = 1;
            this.proficiency = 1;
            this.newStrength = 10;
            this.newDexterity = 10;
            this.newConstitution = 10;
            this.newIntelligence = 10;
            this.newWisdom = 10;
            this.newCharisma = 10;
            this.proficiencies = [];
            this.expertise = [];
            this.proficiency = 1;
            this.attacks = [];
        },
        addMonster: function(){
            this.monsters.push({
                name: this.newName,
                hitpoints: this.newHP,
                proficiency: this.proficiency,
                strength: this.newStrength, 
                dexterity: this.newDexterity,
                constitution: this.newConstitution,
                intelligence: this.newIntelligence,
                wisdom: this.newWisdom,
                charisma: this.newCharisma,
                proficiencies: this.proficiencies,
                expertise: this.expertise,
                attacks: this.attacks
            });
            this.resetFields();
            this.refocus();
        },
        addRoll: function(roll){
            this.rolls.push(roll);
        },
        scrollRollReport: function(){
            var rollReport = document.getElementById('roll-reporter'); 
            rollReport.scrollTo(0, rollReport.scrollHeight);
            return true;
        },
        addSkill: function(){
            if (this.newSkill == '' || this.selectedSkills.indexOf(this.newSkill) >= 0) return false;

            if (this.newSkillLevel == 'proficient') Vue.set(this.proficiencies, this.proficiencies.length, this.newSkill);
            else if (this.newSkillLevel == 'expert') Vue.set(this.expertise, this.expertise.length, this.newSkill);

            this.addingSkill = false; 
            return true;
        },
        removeProficiency: function(p) {
            var i = this.proficiencies.indexOf(p);
            if (i >= 0) this.proficiencies.splice(i, 1);
            return true;
        },
        removeExpertise: function(e) {
            var i = this.expertise.indexOf(e);
            if (i >= 0) this.expertise.splice(i, 1);
            return true;
        },
        openSkillForm: function(){
            this.addingSkill = true;
            return true;
        },
        openAttackForm: function(){
            this.addingAttack = true;
            return true;
        },
        addAttack: function() {
            this.addingAttack = false;
            this.attacks.push({
                name: this.newAttackName,
                type: this.newAttackType,
                range: this.newAttackRange,
                target: this.newAttackTarget,
                hit: this.newAttackHit
            });
            return true;
        }
    },
    mounted: function(){
        this.refocus();
    }
});