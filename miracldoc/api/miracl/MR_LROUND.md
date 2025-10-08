# MR_LROUND

`MR_LROUND`

```c
#ifdef MR_FP
  #ifdef MR_FP_ROUNDING
/* slightly dicey - for example the optimizer might remove the MAGIC ! */
    #define MR_LROUND(a)   ( ( (a) + MR_MAGIC ) - MR_MAGIC )
  #else
/* 
modfl()：提取浮点数 x 的整数部分和小数部分，整数部分被存入参数 intptr 中，小数部分被放入返回值中。
函数原型：long double modfl( long double arg, long double* iptr ); 
*/
    #define MR_LROUND(a)   (modfl((a),&ldres),ldres)
  #endif
#else
  #define MR_LROUND(a)   ((a))
#endif
```