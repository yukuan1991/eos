<template>
    <div id="user">
        <div id="left-nav" class="">
            <div class="logo">
                <img src="../assets/images/eo.png">
            </div>
            <leftNav></leftNav>
        </div>
        <div id="right-content">
            <div id="user-con">
                <div id="user-content" class="clearfix">
                    <router-view ></router-view>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import leftNav from '../components/leftNav.vue'
import { mapState, mapActions } from "vuex";
export default {
    data(){
        return{
        }
    },
    components:{
        leftNav
    },
    
    watch: {
    },
    mounted () {
    },
    
    
    
}
</script>
<style lang="sass" scoped>
</style>
