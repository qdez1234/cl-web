<template>
    <div class="pdf-box">
        <iframe ref="pdfIframe" :src="url" width="100%" height="100%" frameborder="0"></iframe>
    </div>
</template>

<script>
import request from "@/utils/request";
export default {
    data() {
        return {
            url: "",
        };
    },
    mounted() {
        this.pdfUrl();
        const iframe = this.$refs.pdfIframe;
    },
    methods: {
        handleClick() {

        },
        async pdfUrl() {
            const iframe = this.$refs.pdfIframe;
            const res = await request({
                url: '/api/template/download',
                method: 'post',
                data: { "templateName": "BaseCustomerReport1" },
                responseType: 'arraybuffer',
            });
            const blob = new Blob([res], { type: 'application/pdf' });
            this.url = window.URL.createObjectURL(blob);

            iframe.addEventListener('load', (event) => {
                const iframeWindow = event.target.contentWindow;
                const iframeDocument = iframeWindow.document;

                console.log(event, 'event')
                iframeDocument.addEventListener('click', (event) => {
                    console.log('Iframe content clicked!');
                    console.log(event);  // 事件信息，触发事件的元素等
                });
            });
        },
        handleIframeClick() {
            console.log(132)
        }
    }
};
</script>
<style lang="scss" scoped>
.pdf-box {
    height: 100%;
    overflow: hidden;
}
</style>
