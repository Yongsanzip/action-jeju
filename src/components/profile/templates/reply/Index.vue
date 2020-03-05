<template>
    <div class="card-route-wrap">
        <!-- card -->
        <div class="card-route">
            <div class="route-image-box">
                <img :src="`http://img.actionjeju.com/data/user_route_image/${data.tourimg}`" alt="">
            </div>
            <div class="route-contents-box">
                <div>
                    <p class="route-name">오롯이 혼자즐기는 혼행!</p>
                    <p class="route-write">asd</p>
                </div>
                <p class="route-text">
                    {{data.comment}}
                </p>
            </div>
            <a href="" class="link"></a>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Review',
    props:['data']
}
</script>