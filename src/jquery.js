window.jQuery = function(selectorOrArrayOrTemplate){
  let elements
  if(typeof selectorOrArrayOrTemplate === 'string'){
    if(selectorOrArrayOrTemplate[0] === '<'){
      // 创建 div
      elements=[createElement(selectorOrArrayOrTemplate)]
    }else{
      // 查找 div
      elements = document.querySelectorAll(selectorOrArrayOrTemplate)
    }
  }else if(selectorOrArrayOrTemplate instanceof Array){
    elements = selectorOrArrayOrTemplate
  }

  function createElement(string){
    const container = document.createElement("template");
    container.innerHTML = string.trim();
    return container.content.firstChild;
  }
  // api 可以操作elements
  return {
    jquery: true,
    elements: elements,
    get(index){
      return elements[index]
    },
    appendTo(node){
      if(node instanceof Element){
        this.each(el => node.appendChild(el))
      }else if(node.jquery === true){
        this.each(el => node.get(0).appendChild(el))
      }
    },
    append(children){
      if(children instanceof Element){
        this.get(0).appendChild(children)
      }else if(children instanceof HTMLCollection){
        for(let i =0;i<children.length;i++){
          this.get(0).appendChild(children[i])
        }
      }else if(children.jquery === true){
        children.each(node => this.get(0).appendChild(node))
      }
    },
    find(selector){
      let array = []
      for(let i =0;i<elements.length;i++){
        const elements2 = Array.from(elements[i].querySelectorAll(selector))
        array = array.concat(elements2)
      }
      array.oldApi = this // this 就是 旧 api
      return jQuery(array)
    },
    each(fn){
      for(let i=0; i<elements.length;i++){
        fn.call(null, elements[i], i)
      }
      return this
    },
    parent(){
      const array = []
      this.each((node)=>{
        if(array.indexOf(node.parentNode) === -1){
          array.push(node.parentNode)
        }
      })
      return jQuery(array)
    },
    children(){
      const array = []
      this.each((node)=>{
        if(array.indexOf(node.parentNode) === -1){
          array.push(...node.children)
        }
      })
      return jQuery(array)
    },
    print(){
      console.log(elements)
    },
    // 闭包：函数访问外部的变量
    addClass(className){
      for(let i=0;i<elements.length;i++){
        const element = elements[i]
        element.classList.add(className)
      }
      return this
    },
    oldApi: selectorOrArrayOrTemplate.oldApi,
    end(){
      return this.oldApi  // this 就是新 api
    },
  }
}

window.$ = window.jQuery