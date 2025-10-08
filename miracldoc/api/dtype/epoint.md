# epoint类型

`epoint`类型定义在`miracl.h`

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
```