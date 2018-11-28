(function () {
    var metadata = {};

Draw.loadPlugin(function(ui) {
    console.log('Plugin Carregado');

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'http://127.0.0.1:8887/metadata.json', true);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            if(xmlhttp.status == 200) {
                var obj = JSON.parse(xmlhttp.responseText);
                metadata = obj;
            }
        }
    };
    xmlhttp.send(null);
});

Format.prototype.refresh = function() {
    if ("0px" != this.container.style.width) {
        this.clear();
        var ui = this.editorUi
            , graph = ui.editor.graph
            , div = document.createElement("div");
        div.style.whiteSpace = "nowrap";
        div.style.color = "rgb(112, 112, 112)";
        div.style.textAlign = "left";
        div.style.cursor = "default";
        var panelDiv = document.createElement("div");
        panelDiv.style.border = "1px solid #c0c0c0";
        panelDiv.style.borderWidth = "0px 0px 1px 0px";
        panelDiv.style.textAlign = "center";
        panelDiv.style.fontWeight = "bold";
        panelDiv.style.overflow = "hidden";
        panelDiv.style.display = mxClient.IS_QUIRKS ? "inline" : "inline-block";
        panelDiv.style.paddingTop = "8px";
        panelDiv.style.height = mxClient.IS_QUIRKS ? "34px" : "25px";
        panelDiv.style.width = "100%";
        this.container.appendChild(div);
        if (graph.isSelectionEmpty())
            mxUtils.write(panelDiv, mxResources.get("diagram")),
            this.showCloseButton && (graph = document.createElement("img"),
                graph.setAttribute("border", "0"),
                graph.setAttribute("src", Dialog.prototype.closeImage),
                graph.setAttribute("title", mxResources.get("hide")),
                graph.style.position = "absolute",
                graph.style.display = "block",
                graph.style.right = "0px",
                graph.style.top = "8px",
                graph.style.cursor = "pointer",
                graph.style.marginTop = "1px",
                graph.style.marginRight = "17px",
                graph.style.border = "1px solid transparent",
                graph.style.padding = "1px",
                graph.style.opacity = .5,
                panelDiv.appendChild(graph),
                mxEvent.addListener(graph, "click", function() {
                    ui.actions.get("formatPanel").funct()
                })),
                div.appendChild(panelDiv),
                this.panels.push(new DiagramFormatPanel(this,ui,div));
        else if (graph.isEditing())
            mxUtils.write(panelDiv, mxResources.get("text")),
                div.appendChild(panelDiv),
                this.panels.push(new TextFormatPanel(this,ui,div));
        else {
            var contemLabel = this.getSelectionState().containsLabel
                , e = null
                , h = null
                , c = mxUtils.bind(this, function (a, b, c) {
                var d = mxUtils.bind(this, function (d) {
                    e != a && (contemLabel ? this.labelIndex = c : this.currentIndex = c,
                    null != e && (e.style.backgroundColor = this.inactiveTabBackgroundColor,
                        e.style.borderBottomWidth = "1px"),
                        e = a,
                        e.style.backgroundColor = "",
                        e.style.borderBottomWidth = "0px",
                    h != b && (null != h && (h.style.display = "none"),
                        h = b,
                        h.style.display = ""))
                });
                mxEvent.addListener(a, "click", d);
                c == (contemLabel ? this.labelIndex : this.currentIndex) && d()
            })
                , g = 0;
            panelDiv.style.backgroundColor = this.inactiveTabBackgroundColor;
            panelDiv.style.borderLeftWidth = "1px";
            panelDiv.style.width = contemLabel ? "33.3%" : "25%";
            panelDiv.style.width = contemLabel ? "33.3%" : "25%";
            var k = panelDiv.cloneNode(!1)
                , l = k.cloneNode(!1)
                , j = k.cloneNode(!1);
            k.style.backgroundColor = this.inactiveTabBackgroundColor;
            l.style.backgroundColor = this.inactiveTabBackgroundColor;
            j.style.backgroundColor = this.inactiveTabBackgroundColor;
            if (contemLabel)
                k.style.borderLeftWidth = "0px";
            else {
                panelDiv.style.borderLeftWidth = "0px";
                mxUtils.write(panelDiv, mxResources.get("style"));
                div.appendChild(panelDiv);
                var m = div.cloneNode(!1);
                m.style.display = "none";
                this.panels.push(new StyleFormatPanel(this, ui, m));
                this.container.appendChild(m);
                c(panelDiv, m, g++)
            }
            mxUtils.write(k, mxResources.get("text"));
            div.appendChild(k);
            panelDiv = div.cloneNode(!1);
            panelDiv.style.display = "none";
            this.panels.push(new TextFormatPanel(this, ui, panelDiv));
            this.container.appendChild(panelDiv);

            mxUtils.write(l, mxResources.get("arrange"));
            div.appendChild(l);
            var divOriginal = div;
            div = div.cloneNode(!1);
            div.style.display = "none";
            this.panels.push(new ArrangePanel(this, ui, div));
            this.container.appendChild(div);

            mxUtils.write(j, 'Arquitetura');
            divOriginal.appendChild(j);
            var div2 = div.cloneNode(!1);
            div2.style.display = "none";
            this.panels.push(new TestPanel(this, ui, div2));
            this.container.appendChild(div2);

            c(k, panelDiv, g++);
            c(l, div, g++);
            c(j, div2, g++);
        }
    }
};

TestPanel = function(a, c, d) {
    BaseFormatPanel.call(this, a, c, d);
    this.init()
    this.fields = [];
}
;
mxUtils.extend(TestPanel, BaseFormatPanel);

TestPanel.prototype.init = function() {
    var selectionState = this.format.getSelectionState();
    console.log(selectionState);

    var type = selectionState.vertices.length ? selectionState.vertices[0].getAttribute('iType') : selectionState.edges[0].getAttribute('iType') || 'firewallRule';

    if(type) {
        var self = this;
        metadata.elements[type].fields.forEach(function (el, i) {
            self.container.append(self.addField(el.id, el.label, el.options))
        });
    }
};

TestPanel.prototype.addField = function (id, label, options) {
    var selectionState = this.format.getSelectionState();
    var diagramElement = selectionState.vertices[0] || selectionState.edges[0];
    var value = diagramElement.getAttribute(id);

    var rowContainer = document.createElement("div");
    rowContainer.classList.add('geToolbarContainer');
    rowContainer.style.padding = '4px 0px 4px 18px';
    rowContainer.style['border-width'] = '0px';
    rowContainer.style['border-bottom-style'] = 'solid';
    rowContainer.style['border-bottom-color'] = 'rgb(192, 192, 192)';
    rowContainer.style.position = 'relative';
    rowContainer.style['margin-left'] = '0px';
    rowContainer.style['font-weight'] = 'normal';

    rowContainer.append(label);

    var input = options ? document.createElement('select') : document.createElement('input');

    if(options && options.length) {
        options.forEach(function (el, i) {
            var option = document.createElement('option');

            option.append(el.label);
            option.value = el.value;

            input.appendChild(option);
        });
    }

    input.style.position = 'absolute';
    input.style.right = '20px';
    input.style.width = '97px';
    input.style['margin-top'] = '-2px';
    input.name = id;

    if(value)
        input.value = value;

    rowContainer.appendChild(input);

    console.log(this);
    var self = this;
    input.onchange = function (ev) {
        diagramElement.setAttribute(id, input.value);
        if(options) {
            diagramElement.setAttribute(id + '_description', options.filter(function (v) {
                return v.value === input.value;
            })[0].label);
        }
        self.editorUi.editor.graph.refresh();
    };

    return rowContainer;
};

})();