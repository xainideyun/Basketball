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
			<view class="uni-form-item uni-row">
				<view class="title">
					<text class="jdcat jdcat-phone"></text>
					<text>手机号</text>
				</view>
				<view class="input-content">
					<view>
						<input class="weui-input" v-model="entity.phone" maxlength="20" placeholder="输入..." />
					</view>
				</view>
			</view>
			<view class="uni-form-item uni-row">
				<view class="title">
					<text class="jdcat jdcat-fenlei"></text>
					<text>参与形式</text>
				</view>
				<view class="input-content">
					<radio-group @change="statusChange" class="statuslist">
						<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in [{name: '参与', value: 1}, {name: '缺席', value: 2}, {name: '待定', value: 4}]"
						 :key="index">
							<view>
								<radio :value="item.value" :checked="item.value === entity.status" />
							</view>
							<view>{{item.name}}</view>
						</label>
					</radio-group>
				</view>
			</view>
			<view class="uni-form-item uni-row">
				<view class="title">
					<text class="jdcat jdcat-tip"></text>
					<text>其他说明</text>
				</view>
				<view class="input-content">
					<view>
						<input class="weui-input" v-model="entity.remark" placeholder="输入..." />
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
			let name = uni.getStorageSync('historyName') || userinfo.name || userinfo.nickName;
			let phone = uni.getStorageSync('historyPhone') || userinfo.phone;
			let number = uni.getStorageSync('historyNumber') || userinfo.playNumber;
			return {
				entity: {
					name: name,
					playNumber: number,
					userInfoId: userinfo.id,
					gender: userinfo.gender,
					phone: phone,
					faceUrl: userinfo.faceUrl,
					activityEnrollId: 0,
					status: 1,
					show: false
				},
				loading: false
			}
		},
		onLoad(e) {
			this.entity.activityEnrollId = e.id
		},
		methods: {
			statusChange: function(e) {
				this.entity.status = +e.detail.value
			},
			onClose: function() {
				this.show = false
			},
			formSubmit: function(e) {
				if (!this.entity.name) {
					uni.showToast({
						title: '请输入姓名',
						icon: 'none'
					})
					return
				}
				let self = this
				uni.showModal({
					title: '提示',
					content: '确定报名吗？',
					success(res) {
						if (!res.confirm) return
						self._submit()
					}
				})
			},
			_submit: function() {
				let self = this
				this.loading = true
				uni.showLoading({
					title: '正在报名'
				})
				http.post('/activity/join', this.entity)
					.then(function(res) {
						uni.hideLoading()
						uni.setStorageSync('historyName', self.entity.name)
						uni.setStorageSync('historyNumber', self.entity.playNumber)
						uni.setStorageSync('historyPhone', self.entity.phone)
						uni.showToast({
							title: '报名成功'
						})
						setTimeout(function() {
							uni.navigateBack()
						}, 1500);
					})
					.catch(function(err) {
						uni.showToast({
							title: err.data.message,
							icon: 'none'
						})
						uni.hideLoading()
						this.loading = false
					})
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
