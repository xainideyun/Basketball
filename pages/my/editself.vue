<template>
	<view class="">
		<form @submit="formSubmit">
			<view class="uni-form-item uni-row">
				<view class="title">
					<text class="jdcat jdcat-person1"></text>
					<text>昵称</text>
				</view>
				<view class="input-content">
					<view>
						<input class="weui-input" v-model="userinfo.nickName" maxlength="20" placeholder="输入..." />
					</view>
				</view>
			</view>
			<view class="uni-form-item uni-row">
				<view class="title">
					<text class="jdcat jdcat-name"></text>
					<text>真实姓名</text>
				</view>
				<view class="input-content">
					<view>
						<input class="weui-input" v-model="userinfo.name" maxlength="20" auto-focus placeholder="输入..." />
					</view>
				</view>
			</view>
			<view class="uni-form-item uni-row">
				<view class="title">
					<text class="jdcat jdcat-phone"></text>
					<text>手机号</text>
				</view>
				<view class="input-content">
					<view>
						<input class="weui-input" v-model="userinfo.phone" type="number" placeholder="输入..." />
					</view>
				</view>
			</view>
			<view class="uni-form-item uni-row">
				<view class="title">
					<text class="jdcat jdcat-number"></text>
					<text>球衣号码</text>
				</view>
				<view class="input-content">
					<view>
						<input class="weui-input" v-model="userinfo.playNumber" type="number" placeholder="输入..." />
					</view>
				</view>
			</view>
			<view style="margin: 20upx;">
				<text style="color: #888;">真实姓名与手机号将在报名或统计的时候使用。</text>
			</view>

			<view class="uni-btn-v">
				<button formType="submit" type="primary" style="margin: 0 50upx; background-color: #007aff;">保存并退出</button>
			</view>
		</form>
	</view>
</template>

<script>
	import {
		http
	} from '../../utils/luch-request/index.js'

	export default {
		data() {
			return {
				userinfo: JSON.parse(JSON.stringify(this.$store.state.userinfo))
			}
		},
		methods: {
			formSubmit: async function() {
				if (!this.userinfo.nickName) {
					uni.showToast({
						title: '请输入昵称',
						icon: 'none'
					});
					return;
				}
				if (!this.userinfo.name) {
					uni.showToast({
						title: '请输入真实姓名',
						icon: 'none'
					});
					return;
				}
				if (!this.userinfo.phone) {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					});
					return;
				}
				if (!this.userinfo.playNumber) {
					uni.showToast({
						title: '请输入常用号码',
						icon: 'none'
					});
					return;
				}
				uni.showLoading({
					title: '请稍等...',
					mask: true
				});
				var {
					data
				} = await http.put('/user/' + this.userinfo.id, this.userinfo)
				if (data.code > 0) {
					uni.showToast({
						title: data.message
					});
					return;
				}

				uni.showToast({
					title: '保存成功'
				});
				this.$store.commit('setUserInfo', this.userinfo)
				setTimeout(() => uni.navigateBack({
					delta: 1
				}), 2000)
			}
		}
	}
</script>

<style>
</style>
