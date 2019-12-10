<template>
	<view class="page">
		<view class="field-item">
			<text class="jdcat jdcat-person1"></text>
			<text class="field-content">姓名：{{person.name || ''}}</text>
		</view>
		<view class="field-item">
			<text class="jdcat jdcat-phone"></text>
			<text class="field-content">电话：{{person.phone || ''}}</text>
		</view>
		<view class="field-item">
			<text class="jdcat jdcat-date"></text>
			<text class="field-content">报名时间：{{person.createTime}}</text>
		</view>
<!-- 		<view class="field-item">
			<text class="jdcat jdcat-number"></text>
			<text class="field-content">球衣号码：{{person.playNumber || ''}}</text>
		</view> -->
		<view class="field-item">
			<text class="jdcat jdcat-fenlei"></text>
			<text class="field-content">参赛状态：<text :class="person.status == 1 ? 'text-green' : 'text-red'">{{joinStatus(person.status)}}</text></text>
		</view>
		<view class="field-item">
			<text class="jdcat jdcat-tip"></text>
			<text class="field-content">其他说明：{{person.remark || ''}}</text>
		</view>

	</view>

</template>

<script>
	import {
		joinStatus
	} from "@/utils/enum.js"
	export default {
		data(){
			return {
				
				person: uni.getStorageSync('page-people')
			}
		},
		methods: {
			joinStatus: function(status) {
				return joinStatus[status];
			}
		}
	}
</script>

<style>
</style>
