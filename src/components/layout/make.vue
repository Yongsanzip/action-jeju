<template>
    <div style="height: 100%">
        <router-view :key="$route.fullPath"></router-view>
    </div>
</template>
<script>
    export default {
        name: "MakeIndex",
    }
</script>