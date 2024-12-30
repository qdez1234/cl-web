<template>
    <div class="toolbar">
        <div class="start" @click="HandlePrint">dayin</div>
        <div class="content"></div>
        <div class="end"></div>
    </div>

    <div class="printBox">
        <div class="pdf-view-list">
            <div class="item active-item" v-for="(item, index) in pdfPages" @click="HandleClick(index)" :key="index">
                <a :href="`#view${index}`">
                    <div class="pdf-box">
                        <canvas :id="`pdf-canvas-list-${index + 1}`" :key="index" />
                    </div>
                    <div class="page">{{ index + 1 }}</div>
                    <div class="mask" :class="{ active: activePage === index + 1 }"></div>
                </a>
            </div>
        </div>
        <div class="priview-box"  @scroll="onScroll">
            <div class="priview" v-for="(item, index) in pdfPages" :key="index" :id="`view${index}`">
                <canvas :id="`pdf-canvas-view-${index + 1}`" :key="index" />
            </div>
        </div>
    </div>
    <iframe ref="pdfIframe" class="pdfBox" :src="url" width="0" height="0" frameborder="0"></iframe>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import request from "@/utils/request";
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

let pdfDoc = ""
const url = ref('');
const pdfIframe = ref(null)
let activePage = ref(1)
const pdfPages = ref(0);

/**
 * 切换pdf页码
 * @param index 
 */
const HandleClick = (index) => {
    activePage.value = index + 1
}
/**
 * pdf数据获取
 */
const pdfUrl = async () => {
    try {
        const res = await request({
            url: '/api/common/print/BaseCustomer',
            method: 'post',
            data: {
                "_templateName": "CustomerReport1",
                "id": 10042
            },
            responseType: 'arraybuffer',
        });
        const blob = new Blob([res], { type: 'application/pdf' });
        url.value = window.URL.createObjectURL(blob);
        const loadingTask = pdfjsLib.getDocument(url.value);
        loadingTask.promise
            .then(async (pdf) => {
                pdf.loadingParams.disableAutoFetch = true;
                pdf.loadingParams.disableStream = true;
                pdfDoc = pdf; // 保存加载的pdf文件流
                pdfPages.value = pdfDoc.numPages; // 获取pdf文件的总页数
                await nextTick(() => {
                    renderPage(1); // 将pdf文件内容渲染到canvas
                    renderPage(1, true, 1.3); // 将pdf文件内容渲染到canvas
                });
            })
            .catch((error) => {
                console.warn(`[upthen] pdfReader loadFile error: ${error}`);
            });
    } catch (error) {
        console.error('Failed to load PDF:', error);
    }
};
/**
 * 页面打印
 * @param num 
 */
const renderPage = (num, view = false, scale = 0.3) => {
    pdfDoc.getPage(num).then((page) => {
        page.cleanup();
        // 获取 canvas 元素并获取 2D 上下文
        const canvas = view ? document.getElementById(`pdf-canvas-view-${num}`) : document.getElementById(`pdf-canvas-list-${num}`);
        if (canvas) {
            const ctx = canvas.getContext("2d");
            // 获取设备像素比和浏览器存储的像素比
            const dpr = window.devicePixelRatio || 1;
            const bsr =
                ctx.webkitBackingStorePixelRatio ||
                ctx.mozBackingStorePixelRatio ||
                ctx.msBackingStorePixelRatio ||
                ctx.oBackingStorePixelRatio ||
                ctx.backingStorePixelRatio ||
                1;
            const ratio = dpr / bsr;

            // 获取页面的视图并设置缩放比例
            const viewport = page.getViewport({ scale: scale });

            // 设置 canvas 的宽度和高度，并进行缩放
            canvas.width = viewport.width * ratio;
            canvas.height = viewport.height * ratio;
            canvas.style.width = viewport.width + "px";
            canvas.style.height = viewport.height + "px";
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

            // 渲染页面
            const renderContext = {
                canvasContext: ctx,
                viewport: viewport,
            };
            page.render(renderContext);

            // 预加载下一页
            if (num < pdfPages.value) {
                renderPage(num + 1, view, scale);
            }
        }
    });
};
/**
 * 滚动时同步更新左侧选中的页
 */
 const onScroll = () => {
    const previewBox = document.querySelector('.priview-box');
    const previewHeight = previewBox.clientHeight;
    const scrollTop = previewBox.scrollTop;
    const pageHeight = previewHeight / pdfPages.value; // 计算每页的高度
    const currentPage = Math.floor(scrollTop / pageHeight) + 1; // 当前显示的页面
    activePage.value = currentPage;
};
/**
 * 调取打印程序进行页面打印
 */
const HandlePrint = () => {
    pdfIframe.value.contentWindow.print()
}
onMounted(() => {
    pdfUrl();
});
</script>

<style scoped lang="scss">

.toolbar {
    position: fixed;
    background: #333333;
    width: 100%;
    height: 56px;
    z-index: 999;
}

.printBox {
    display: flex;
    background: #525659;
    padding-top: 56px;
    min-height: 100%;
}

.priview-box {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding-left: 300px;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    scroll-padding-top: 100px;

    .priview {
        margin-bottom: 20px;
    }
}

.pdfBox {
    display: none;
}

.pdf-view-list {
    width: 300px;
    background-color: #333333;
    overflow-y: scroll;
    height: 100vh;
    position: fixed;

    // 隐藏滚动条
    &::-webkit-scrollbar {
        display: none;
    }

    .item {
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding: 20px 20px 0 20px;
        cursor: pointer;

        a {
            text-align: center;
        }

        .pdf-box {
            width: 200px;
            border-radius: 4px;
        }

        .page {
            font-weight: 600;
            font-size: 16px;
            color: #ffffff;
            line-height: 34px;
            z-index: 1;
        }

        .mask {
            width: 100%;
            height: 100%;
            background-color: transparent;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 0;
        }

        .active {
            background-color: #ffaa46;
            opacity: 0.2;
        }
    }
}
</style>