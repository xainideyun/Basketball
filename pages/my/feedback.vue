<template>
	<view class="page">
		<textarea v-model.trim="content" placeholder="请填写您的建议..." />
		
		<button type="primary" @tap="onSubmit">提交</button>
	</view>
</template>

<script>
	import {
		http
	} from '@/utils/luch-request/index.js'
	import {
		jdcat
	} from '@/utils/util.js'
	export default {
		data: function () {
			return {
				content: ''
			}
		},
		methods: {
			onSubmit: async function() {
				if (!this.content) {
					jdcat.showError('请输入您的意见...')
					return
				}
				var body = {
					userInfoId: this.$store.state.userinfo.id,
					content: this.content
				}
				var {data} = await http.post("/util/feedback", body)
				uni.showToast({
					title: '提交成功'
				})
				setTimeout(() => {
					uni.navigateBack({
						delta: 1
					})
				}, 1000)
			}
		}
	}
</script>

<style lang="scss">
	.page {
		
		textarea {
			height: 500upx;
		}
	}
</style>
