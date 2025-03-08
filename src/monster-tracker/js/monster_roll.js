const Roll = Vue.component('roll', {
    props: ['monstername', 'rollstat', 'displaytime', 'dice', 'mods', 'result', 'chatcolor'],
    data: function(){
        return {
            chatstyle: "color:" + this.chatcolor + ";font-weight:bold;"
        };
    },
    mounted: function(){
        this.$parent.scrollRollReport();
    },
    template: `<div class="roll">
        <p><span :style="chatstyle">[{{monstername}}]</span> {{rollstat}} roll:<br/>{{dice}} + {{mods}} = <b>{{result}}</b></p>
    </div>`
});