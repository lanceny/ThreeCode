new Vue({
    // elの要素配下でindexVue.jsが有効になる. 今回はdiv id="app"を指定
    el: "#app",

    data: {
        url: "",
    },

    methods: {
        CopyURL(){
            /*
            url = location.href;
            event.clipboardData.setData("text/plain", url);
            event.preventDefault();
            */
           url = location.href;
           var textBox = document.createElement("textarea");
           textBox.setAttribute("id", "target");
           textBox.setAttribute("type", "hidden");
           textBox.textContent = url;
           document.body.appendChild(textBox);
         
           textBox.select();
           document.execCommand('copy');
           document.body.removeChild(textBox);
        }        
    }
})