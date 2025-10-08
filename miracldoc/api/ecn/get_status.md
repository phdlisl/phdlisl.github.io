# get_status

`get_status`定义在`ecn.h`

```c
int get_status() {return p->marker;}
```

函数功能：返回点的状态，记录在`epoint`的`marker`。

参数：无。

## 源码分析

与`get_status`相关的内容如下。

```c
/* Elliptic Curve epoint structure. Uses projective (X,Y,Z) co-ordinates */

typedef struct {
int marker;
big X;
big Y;
#ifndef MR_AFFINE_ONLY
big Z;
#endif
} epoint;
epoint *p;
int get_status() {return p->marker;}
```

可参考[epoint类型](/parts/api/dtype/epoint.md)的描述。