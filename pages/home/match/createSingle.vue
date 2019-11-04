<template>
	<view>
		<form @submit="formSubmit">
			<view class="uni-form-item uni-row">
				<view class="title">
					<text class="jdcat jdcat-biaoti"></text>
					<text>本队名称</text>
				</view>
				<view class="input-content">
					<view>
						<input class="weui-input" v-model="match.hostName" maxlength="10" auto-focus placeholder="输入名称,最多10个字..." />
					</view>
				</view>
			</view>
			<view class="uni-form-item uni-row">
				<view class="title">
					<text class="jdcat jdcat-address"></text>
					<text>比赛地点</text>
				</view>
				<view class="input-content">
					<view class="input-address">
						<view class="address-info" @tap="toggleAddress()">
							<text class="first">{{match.location}}</text>
							<text class="second">{{match.address}}</text>
						</view>
						<text class="jdcat jdcat-right"></text>
					</view>
				</view>
			</view>
			<view class="uni-btn-v">
				<button formType="submit" type="primary" :loading="loading" style="margin: 0 50upx; background-color: #007aff;">创建</button>
			</view>
		</form>
	</view>
</template>

<script>
	import {
		http
	} from '@/utils/luch-request/index.js'
	export default {
		data() {
			return {
				loading: false,
				match: {
					location: '',
					address: '',
					lng: 0,
					lat: 0,
					hostName: '',
				}
			}
		},
		methods: {
			formSubmit: async function() {
				var user = this.$store.state.userinfo
				var self = this
				if (!this.match.hostName) {
					uni.showToast({
						icon: 'none',
						title: '请输入本队名称'
					})
					return
				}
				if (!this.match.location) {
					uni.showToast({
						icon: 'none',
						title: '请选择比赛地点'
					})
					return
				}

				uni.showModal({
					title: '提示',
					content: '确定创建吗?',
					success: async function(e) {
						if (!e.confirm) return
						var match = {
							...self.match,
							userInfoId: user.id,
							visitorName: '客队',
							teams: [{
									name: self.match.hostName,
									userInfoId: user.id
								},
								{
									name: '客队',
									userInfoId: user.id
								},
							],
						}


						uni.showLoading({
							title: '请稍等...',
							mask: true,
							duration: 5000
						})
						var {
							data
						} = await http.post('/match', match)
						uni.hideLoading()
						uni.showToast({
							title: '创建成功', icon: 'none'
						})
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/home/match/single?id=' + data.result.id
							})
						}, 1000)
					}
				})
			},
			toggleAddress: function() {
				let self = this;
				uni.chooseLocation({
					success: function(res) {
						let {
							name,
							address,
							latitude,
							longitude
						} = res
						self.match.location = name;
						self.match.address = address;
						self.match.lat = longitude;
						self.match.lng = latitude;
					},
					fail(err) {
						if (err.errMsg === 'chooseLocation:fail authorize no response') {
							uni.showModal({
								title: '提示',
								content: '为了推送附近的球场，请授权您的位置信息',
								success(res) {
									if (res.cancel) return;
									uni.openSetting({
										success(res) {
											if (!res.authSetting['scope.userLocation']) return;
											self.toggleAddress();
										}
									})
								}
							})
						}
					}
				});
			}


		}
	}
</script>

<style lang="scss">
	.input-address {
		display: flex;
		flex-flow: row nowrap;

		.address-info {
			flex-grow: 1;
			display: flex;
			flex-flow: column;

			.second {
				color: #777;
				line-height: 1;
			}
		}
	}
</style>
