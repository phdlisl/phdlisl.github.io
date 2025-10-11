# mirvar_mem_variable

`mirvar_mem_variable`定义在`miracl.h`，实现在`mrcore.c`


```c
extern flash mirvar_mem_variable(char *,int,int);
```

函数功能：为字符数组`mem`的元素对齐设置。

参数`mem`：字符数组或字符指针。

参数`index`：下标。

参数`sz`：个数。


## 源码分析

与`mirvar_mem_variable`定义相关的函数如下。

```c
struct bigtype
{
    mr_lentype len;
    mr_small *w;
};                
typedef struct bigtype *big;
typedef big flash;

#define MR_INIT_ECN memset(mem,0,mr_ecp_reserve(1,ZZNS)); p=(epoint *)epoint_init_mem_variable(mem,0,ZZNS); 

flash mirvar_mem_variable(char *mem,int index,int sz)
{
    flash x;
    int align;
    char *ptr;
    int offset,r;

/* alignment */
    offset=0;
    // 与long对齐
    r=(unsigned long)mem%MR_SL;
    if (r>0) offset=MR_SL-r; // 偏移量

    // 取第offset+mr_size(sz)*index个元素，并转换为big类型
    x=(big)&mem[offset+mr_size(sz)*index];
    // 指向x的w
    ptr=(char *)&x->w;
    // 对齐位置
    align=(unsigned long)(ptr+sizeof(mr_small *))%sizeof(mr_small);   
    x->w=(mr_small *)(ptr+sizeof(mr_small *)+sizeof(mr_small)-align);   

    return x;
}
```

`char`类型指针`mem`指向一个初始化为0的存储单元，作为[epoint_init_mem_variable](/miracldoc/api/mrcore/epoint_init_mem_variable.md)的参数之一，`epoint_init_mem_variable`内部调用`mirvar_mem_variable`。

`(unsigned long)mem`对`char *`强制类型转换，也就是`mem`的地址强制转换为`unsigned long`。对`(unsigned long)mem%MR_SL`，校验`r`的地址余数是否与`long`对齐。如果没有对齐，`offset`纪录偏移量。

[mr_size](/miracldoc/api/miracl/mr_size.md)计算需要的字节数，取`mem`的第`offset+mr_size(sz)*index`个元素，并强制转换为`big`类型，放在`x`。



## 测试地址类型转换

`(unsigned long)mem`对`char *`强制类型转换，也就是地址常量强制类型转换。

```c
#include <stdio.h>
#include <string.h>

#define N 8

int main(){
	char mems[N];
	char *mem = mems;

	memset(mems, 0, sizeof(char) * N);

	int i = 0;
	for(i = 0; i < N; i ++){
		printf("%4X", mems[i]); // 全0
	}
	printf("\n");

	mems[0] = 0X41;

	//对mems的地址强制类型转换
	unsigned long l = (unsigned long)(mem);

	printf("l = %lX\n", l); // mems的地址
	printf("mem = %lX\n", mem); // mems的地址
	printf("mems = %lX\n", mems); // mems的地址

	return 0;
}
```

测试输出

```c
   0   0   0   0   0   0   0   0
l = 16D4B7930
mem = 16D4B7930
mems = 16D4B7930
```



