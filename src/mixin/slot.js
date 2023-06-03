export function passRef(refName) {
	return {
		mounted() {
			this.$nextTick(() => {
				this.$refs[refName].$slots = this.$slots;
				this.$refs[refName].$scopedSlots = this.$scopedSlots;
				this.$nextTick(this.$refs[refName].$forceUpdate);
			});
		},
		beforeUpdate() {
			this.$refs[refName].$slots = this.$slots;
			this.$refs[refName].$scopedSlots = this.$scopedSlots;
		},
	}
}

export function passRefList(refName) {
	return {
		mounted() {
			this.$nextTick(() => {
				this.$refs[refName].forEach(vNode => {
					vNode.$slots = this.$slots;
					vNode.$scopedSlots = this.$scopedSlots;
					vNode.$nextTick(vNode.$forceUpdate)
				})
			})
		},
		beforeUpdate() {
			this.$refs[refName].forEach(vNode => {
				vNode.$slots = this.$slots;
				vNode.$scopedSlots = this.$scopedSlots;
			})

		},
	}
}
