Vue.component('account-alias', {
  props: {
    account: String,
    send: {
      type: Boolean,
      default: false
    },
  },
  data: function () {
    return {
      alias: null,
      url: '/account/' + this.account
    }
  },
  methods: {
    getAlias() {
      axios
        .get('/api/accounts/' + this.account)
        .then(response => (this.alias = response.data.alias))
        .catch(reason => {});
    }
  },
  created() {
    this.getAlias();
    if (this.send) {
      this.url = '/account/' + this.account + '/send';
    }
  },
  template: '<a v-bind:href="url"><span><b v-if="alias">{{alias}} - </b>{{ account }}</span></a>'
})

Vue.component('account-alias-sm', {
  props: ['account'],
  data: function () {
    return {
      alias: null
    }
  },
  methods: {
    getAlias() {
      axios
        .get('/api/accounts/' + this.account)
        .then(response => (this.alias = response.data.alias))
        .catch(reason => {});
    }
  },
  created() {
    this.getAlias();
  },
  template: '<a v-bind:href="\'/account/\'+ account"><b v-if="alias">{{alias}}</b><span v-if="!alias">{{account.substring(0,10)}}...</span></a>'
})

Vue.filter('toBanano', function (value) {
  if (!value) return ''
  value = value.toString()

  multBANANO = Big('100000000000000000000000000000');

  return Big(value).div(multBANANO).toFixed(6).toString()
})

Vue.filter('formatHash', function (hash) {
  if (!hash) return ''
  hash = hash.toString()

  var first = hash.substring(0, 2);
  var middle_raw = hash.substring(2, hash.length-2);
  var last = hash.substring(hash.length-2, hash.length);

  var middle = '';

  for (const part of middle_raw.match(/.{1,6}/g)) {
    middle = middle + '<span class="hashcolor" style="color:#' + part + ';background-color:#' + part + '">' + part + '</span>';
  }

  return first + middle + last;
})

Vue.filter('toCurrency', function (value) {
  if (typeof value !== "number") {
      return value;
  }
  var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 6
  });
  return formatter.format(value);
});

Vue.filter('toLocaleString', function (value) {
  if(isNaN(value)) return '0';
  return Number.parseFloat(value).toLocaleString('en-US')
})

Vue.filter('momentFromNow', function (value) {
  return moment(value).fromNow();
})

Vue.filter('momentUnixFromNow', function (value) {
  if(value == 0){
    return 'Unknown'
  }
  return moment.unix(value).fromNow();
})

Vue.filter('momentUnixFormat', function (value) {
  return moment.unix(value).format('YYYY-MM-DD HH:mm:ss');
})

Vue.filter('round', function (value, precision) {
  if (Number.isInteger(precision)) {
    var shift = Math.pow(10, precision);
    return Math.round(value * shift) / shift;
  } else {
    return Math.round(value);
  }
})
