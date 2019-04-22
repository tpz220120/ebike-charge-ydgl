// pages/components/mytree/mytree.js
Component({
  properties: {
    model: Object,
  },

  data: {
    open: false,
    isBranch: false,
  },

  methods: {
    toggle: function (e) {
      if (this.data.isBranch) {
        this.setData({
          open: !this.data.open,
        })
      }
    },

    tapItem: function (e) {
      var itemid = e.currentTarget.dataset.itemid;
      var type = e.currentTarget.dataset.type;
      var name = e.currentTarget.dataset.name;
      console.log('组件里点击的id: ' + itemid);
      this.triggerEvent('tapitem', { itemid: itemid, type:type,name:name}, { bubbles: true, composed: true });
    }
  },

  ready: function (e) {
    this.setData({
      isBranch: Boolean(this.data.model.childList && this.data.model.childList.length),
    });
  },
})