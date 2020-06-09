<template>
	<view class="page">
		<view>
			<text>步骤一</text>
		</view>
		<image src="../../../static/1.jpg" mode="aspectFit"></image>
		<view class="">
			<text>步骤二</text>
		</view>
		<image src="../../../static/2.jpg" mode="aspectFit"></image>
		<view class="">
			<text>步骤三</text>
		</view>
		<image src="../../../static/3.jpg" mode="aspectFit"></image>
		<view class="">
			<text>步骤四</text>
		</view>
		<image src="../../../static/4.jpg" mode="aspectFit"></image>
		<view class="">
			<text>步骤五</text>
		</view>
		<image src="../../../static/5.jpg" mode="aspectFit"></image>
		<ad unit-id="adunit-2412e37f507a6d4a"></ad>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		onShareAppMessage: function() {
			return {
				title: '篮球爱好者必备工具',
				path: '/pages/home/match/matchnote'
			}
		},
	}
</script>

<style lang="scss">
	.page {
		display: flex;
		flex-flow: column;
		align-items: center;
		height: 5500upx;
		
		image {
			margin-bottom: 20upx;
			height: 1000upx;
			width: 650upx;
		}
		
		view {
			width: 650upx;
		}
	}
</style>
