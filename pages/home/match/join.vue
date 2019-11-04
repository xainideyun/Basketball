<template>
	<view>
		<form @submit="formSubmit">
			<view class="uni-form-item uni-row">
				<view class="title">
					<text class="jdcat jdcat-person1"></text>
					<text>姓名</text>
				</view>
				<view class="input-content">
					<view>
						<input class="weui-input" v-model="entity.name" maxlength="20" auto-focus placeholder="输入姓名..." />
					</view>
				</view>
			</view>
			<view class="uni-form-item uni-row">
				<view class="title">
					<text class="jdcat jdcat-number"></text>
					<text>号码</text>
				</view>
				<view class="input-content">
					<view>
						<input class="weui-input" v-model="entity.playNumber" type="number" placeholder="输入..." />
					</view>
				</view>
			</view>
			<view class="uni-btn-v">
				<button formType="submit" type="primary" :loading="loading" style="margin: 0 50upx; background-color: #007aff;">确定</button>
			</view>
		</form>
		<user-login :show="show" @close="onClose"></user-login>
	</view>
</template>

<script>
	import {
		http
	} from "@/utils/luch-request/index.js"
	import userLogin from "@/components/basketball/user-login.vue"
	export default {
		data() {
			let userinfo = this.$store.state.userinfo
			let name = uni.getStorageSync('historyName') || userinfo.name || userinfo.nickName || '';
			let num = uni.getStorageSync('historyNumber') || userinfo.playNumber || '';
			return {
				entity: {
					name: name,
					playNumber: num,
					faceUrl: '',
					teamId: 0,
					show: false
				},
				loading: false
			}
		},
		onLoad(e) {
			this.entity.teamId = e.id || 1

		},
		methods: {
			formSubmit: function(e) {
				if (!this.entity.name) {
					uni.showToast({
						title: '请输入姓名',
						icon: 'none'
					})
					return
				}
				if (!this.entity.playNumber) {
					uni.showToast({
						title: '请输入号码',
						icon: 'none'
					})
					return
				}
				this.entity.faceUrl = this.$store.state.userinfo.faceUrl
				this.entity.userInfoId = this.$store.state.userinfo.id
				this._submit();
			},
			onClose: function() {
				this.show = false
			},
			_submit: async function() {
				let self = this
				this.loading = true
				uni.showLoading({
					title: '正在加入'
				})
				var {
					data
				} = await http.post('/match/join', this.entity)
				uni.hideLoading()
				if (data.code > 0) {
					this.loading = false
					uni.showToast({
						title: data.message,
						icon: 'none'
					})
					return
				}
				uni.setStorageSync('historyName', this.entity.name)
				uni.setStorageSync('historyNumber', this.entity.playNumber)
				uni.showToast({
					title: '加入成功'
				})
				if (getCurrentPages().length > 1) {
					setTimeout(function() {
						uni.navigateBack()
					}, 1500);
					return
				}
				
				setTimeout(function() {
					
					uni.switchTab({
						url: '/pages/tabBar/home'
					})
				}, 1500);
			}
		}
	}
</script>

<style lang="scss">
	.uni-row {
		background-color: #fff;
		border-bottom: 1px solid #e7e7e7;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: center;
		align-content: center;

		.title {
			padding: 20upx 10upx;
			width: 120upx;
			white-space: nowrap;

			.jdcat {
				color: #828282;
				margin-right: 10upx;
			}
		}

		.input-content {
			flex-grow: 1;
			text-align: right;
			padding: 20upx 20upx 20upx 10upx;

			.jdcat {
				margin-left: 20upx;
			}
		}
	}

	.statuslist {
		display: flex;
		flex-flow: row nowrap;
		justify-content: flex-end;
		font-size: 80%;

		.uni-list-cell-pd {
			padding: 10upx;
			background-color: #fff;
			border-bottom: #fff;
		}

		.uni-list-cell::after {
			background-color: #fff;
		}
	}
</style>
