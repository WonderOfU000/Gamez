class ObjectPool {
  constructor(createFunc, initialSize = 0) {
    this.createFunc = createFunc;
    this.pool = [];
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFunc());
    }
  }

  acquire(...args) {
    let obj;
    if (this.pool.length > 0) {
      obj = this.pool.pop();
      console.log("Object acquired from pool:", obj);
      // Reinitialize object if necessary
      if (obj.reinit) obj.reinit(...args);
    } else {
      obj = this.createFunc(...args);
      console.log("New object created:", obj);
    }
    return obj;
  }

  release(obj) {
    console.log("Object released back to pool:", obj);
    this.pool.push(obj);
  }
}

export default ObjectPool;
