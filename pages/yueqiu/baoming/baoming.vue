<template>
	<view class="page">
		<ad unit-id="adunit-2412e37f507a6d4a"></ad>
		<view class="uni-padding-wrap">
			<form @submit="formSubmit">
				<view class="uni-form-item uni-row">
					<view class="title">
						<text class="jdcat jdcat-biaoti"></text>
						<text>标题</text>
					</view>
					<view class="input-content">
						<view>
							<input class="weui-input" v-model="title" maxlength="20" auto-focus placeholder="输入标题..." />
						</view>
					</view>
				</view>
				<view class="uni-form-item uni-row">
					<view class="title">
						<text class="jdcat jdcat-date"></text>
						<text>日期</text>
					</view>
					<view class="input-content">
						<view @tap="toggleDate()">
							<text>{{activityDate}}</text>
							<text class="jdcat jdcat-right"></text>
						</view>
					</view>
				</view>
				<view class="uni-form-item uni-row">
					<view class="title">
						<text class="jdcat jdcat-time"></text>
						<text>时间</text>
					</view>
					<view class="input-content">
						<view @tap="toggleTime()">
							<text>{{activityTime}}</text>
							<text class="jdcat jdcat-right"></text>
						</view>
					</view>
				</view>
				<view class="uni-form-item uni-row">
					<view class="title">
						<text class="jdcat jdcat-address"></text>
						<text>地点</text>
					</view>
					<view class="input-content">
						<view class="input-address">
							<view class="address-info" @tap="toggleAddress()">
								<text class="first" :style="{color: addressColor}">{{activityAddress}}</text>
								<text class="second">{{activityAddressDetail}}</text>
							</view>
							<!-- <text class="jdcat jdcat-bottom" @tap="addressHistory()"></text> -->
							<text class="jdcat jdcat-right"></text>
						</view>
					</view>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">
						<text class="jdcat jdcat-feedback"></text>
						<text>约球说明</text>
					</view>
					<view class="input-content">
						<view>
							<textarea v-model="remark" auto-height />
							</view>
					</view>
				</view>
				<view class="uni-btn-v">
					<button formType="submit" type="primary" :loading="loading" style="margin: 0 50upx; background-color: #007aff;">确定约球</button>
				</view>
			</form>
		</view>


		<w-picker mode="date" :startYear="startYear + ''" :endYear="endYear + ''" :defaultVal="defaultDate" :current="false"
		 @confirm="dateConfirm" ref="date" themeColor="#f00"></w-picker>
		<w-picker mode="time" :defaultVal="defaultTime" :current="false" @confirm="timeConfirm" step="1" ref="time"
		 themeColor="#f00"></w-picker>
	</view>
</template>

<script>
	import wPicker from '@/components/w-picker/w-picker.vue'
	import  { http } from '@/utils/luch-request/index.js'
	const requestUrl = 'https://unidemo.dcloud.net.cn/ajax/echo/text?name=uni-app'
	const duration = 2000
	export default {
		components: {
			wPicker
		},
		data() {
			let now = new Date(),
				year = now.getFullYear(),
				month = now.getMonth() + 1,
				day = now.getDate(),
				hour = now.getHours(),
				minus = now.getMinutes();

			return {
				loading: false,
				startYear: year - 1,
				endYear: year + 1,
				defaultDate: [1, month - 1, day - 1],
				activityDate: year + '-' + (month > 9 ? '' : '0') + month + '-' + (day > 9 ? '' : '0') + day,
				defaultTime: [20, 0, 0],
				activityTime: '20:00',
				activityAddress: '请选择',
				addressColor: '#aaa',
				activityAddressDetail: '',
				lat: 0,
				lng: 0,
				remark: '',
				title: ''
			}
		},
		methods: {
			toggleDate() {
				this.$refs['date'].show()
			},
			dateConfirm(e) {
				this.activityDate = e.result
			},
			toggleTime() {
				this.$refs['time'].show()
			},
			timeConfirm(e) {
				this.activityTime = e.result.slice(0, 5);
			},
			toggleAddress() {
				let self = this;
				uni.chooseLocation({
					success: function(res) {
						let obj = {name: res.name, address: res.address, lat: res.latitude, lng: res.longitude};
						self.activityAddress = obj.name;
						self.activityAddressDetail = obj.address;
						self.lat = obj.lat;
						self.lng = obj.lng;
						self.addressColor = '#000';
					},
					fail(err) {
						if(err.errMsg === 'chooseLocation:fail authorize no response') {
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
			},
			addressHistory() {
				// todo 历史地址

			},
			formSubmit: function(e) {
				const self = this;
				if (!this.title) {
					uni.showToast({title: '请输入标题', icon: 'none'});
					return;
				}
				if (!this.activityAddressDetail) {
					uni.showToast({title: '请选择地点', icon: 'none'});
					return;
				}
				uni.showModal({
					content: "确定发起报名吗？",
					confirmText: "确定",
					cancelText: "取消",
					success(res) {
						if(!res.confirm) return;
						self._request();
					}
				})
			},
			async _request(){
				let self = this;
				this.loading = true;
				uni.showLoading({
					title: '正在创建', mask: true
				})
				let user = uni.getStorageSync('userinfo');
				let body = { title: this.title, name: user.nickName, activityTime: `${this.activityDate} ${this.activityTime}:00`, location: this.activityAddress, address: this.activityAddressDetail, lng: this.lng, lat: this.lat, remark: this.remark, userInfoId: user.id }
				
				http.post('/activity', body)
					.then(function(res) {
						uni.hideLoading()
						if (res.data.code > 0) {
							uni.showToast({
								icon: 'none', title: res.data.message
							})
							return;
						}
						uni.showToast({title: '创建成功'});
						setTimeout(function(){
							uni.redirectTo({
								url: '/pages/yueqiu/activity/activity?id=' + res.data.result.id
							});
						}, 1500);
					})
					.catch(function(err) {
						uni.showModal({
							title: '错误', content: err.data.msg
						})
						self.loading = false;
						uni.hideLoading()
					})
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

	.uni-padding-wrap {
		width: 750upx;
		padding: 0;
	}
</style>
