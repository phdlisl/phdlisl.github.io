# get_mip()

`get_mip()`在`miracl.h`中定义，在`mrcore.c`中实现。

```c
extern miracl *get_mip(void );
```

函数功能：返回`miracl *`指针。

参数：无。

## 源码分析

与`get_mip()`相关的定义如下：分别在4种不同环境下定义。

1. 在`MR_OPENMP_MT`条件下，直接返回`miracl *`指针。
2. 在`MR_WINDOWS_MT`条件下，返回`miracl *`指针。由`windows.h`提供的`TlsGetValue`函数，取出序列号中存储的数据。
3. 在`MR_UNIX_MT`条件下，返回`miracl *`指针。由`pthread.h`提供的`pthread_getspecific`函数，取出序列号中存储的数据。
4. 在没有定义`MR_WINDOWS_MT`、`MR_UNIX_MT`和`MR_OPENMP_MT`的情况下，返回`miracl *`指针。如果没有定义`MR_STATIC`，则返回的`miracl *`指针为空。

```c
/*** Multi-Threaded Support ***/

#ifndef MR_GENERIC_MT

  #ifdef MR_OPENMP_MT
    #include <omp.h>

#define MR_MIP_EXISTS

    miracl *mr_mip;
    #pragma omp threadprivate(mr_mip)
    
    miracl *get_mip()
    {
        return mr_mip; 
    }

    void mr_init_threading()
    {
    }

    void mr_end_threading()
    {
    }

  #endif

  #ifdef MR_WINDOWS_MT
    #include <windows.h>
    DWORD mr_key;   

    miracl *get_mip()
    {
        return (miracl *)TlsGetValue(mr_key); 
    }

    void mr_init_threading()
    {
        mr_key=TlsAlloc();
    }

    void mr_end_threading()
    {
        TlsFree(mr_key);
    }

  #endif

  #ifdef MR_UNIX_MT
    #include <pthread.h>
    pthread_key_t mr_key;

    miracl *get_mip()
    {
        return (miracl *)pthread_getspecific(mr_key); 
    }

    void mr_init_threading()
    {
        pthread_key_create(&mr_key,(void(*)(void *))NULL);
    }

    void mr_end_threading()
    {
        pthread_key_delete(mr_key);
    }
  #endif

  #ifndef MR_WINDOWS_MT
    #ifndef MR_UNIX_MT
      #ifndef MR_OPENMP_MT
        #ifdef MR_STATIC
          miracl mip;
          miracl *mr_mip=&mip;
        #else
          miracl *mr_mip=NULL;  /* MIRACL's one and only global variable */
        #endif
#define MR_MIP_EXISTS
        miracl *get_mip()
        {
          return (miracl *)mr_mip; 
        }
      #endif
    #endif
  #endif

#ifdef MR_MIP_EXISTS
    void set_mip(miracl *mip)
    {
        mr_mip=mip;
    }
#endif

#endif
```

## 测试`windows.h`提供的线程局部存储（TLS）

`windows.h`提供了`TlsGetValue`等函数处理线程，下面是测试案例。

```c
#include<iostream>
#include<Windows.h>
using namespace std;
LPVOID fun(int ind) {
  return TlsGetValue(ind);
}

DWORD WINAPI testThr(LPVOID lpThreadParameter) {
  int ind = (int)lpThreadParameter;
  cout << "另启线程调用fun函数获取：" << fun(ind) << endl;
  return 0;
}

int main() {
  DWORD index = TlsAlloc(); //分配一个TLS索引
  BOOL ret = TlsSetValue(index, (LPVOID)0x123456);  //设置该索引的值为0x123456
  LPVOID p=TlsGetValue(index);  //根据该索引获取该值
  cout << "主线程Main函数中：" << p << endl; //输出该值
  cout << "主线程调用fun函数：" << fun(index) << endl;  //调用fun函数获取该值
  //创建一个新线程，传入索引
  HANDLE hThr=CreateThread(NULL,0, testThr,(LPVOID)index,NULL,NULL);
  WaitForSingleObject(hThr,5000);   //等待新建线程结束
  TlsFree(index);   //释放该索引
}
```

## 测试`pthread.h`的线程安全存储

UNIX、Linux、MacOS系统下的`pthread.h`，提供了线程处理方法，下面是一个简单的案例。

```c
#include <stdio.h>
#include <pthread.h>
#include <string.h>

static pthread_key_t p_key;
 
void *thread_func(void *args)
{
    int *tmp1, *tmp2;
    
    /* 初始化键值时使用的特征值，是该线程创建时传入的特征值a/b */
    pthread_setspecific(p_key, args); /* 初始化本线程的私有键值 */
    printf("in thread %d. init specific_data to %d\n", *(int *)args, *(int *)args);
    
    tmp1 = (int *)pthread_getspecific(p_key); /* 获取键值 */
    printf("get specific_data %d\n", *tmp1);
 
    *tmp1 = (*tmp1) * 100;  /* 修改键值 */
    printf("change specific_data to %d\n", *tmp1);

    tmp2 = (int *)pthread_getspecific(p_key); /* 重新获取本线程的键值 */
    printf("get specific_data %d\n", *tmp2);
 
    return (void *)0;
}

int main()
{
    int a = 10;
    int b = 20;
    pthread_t pa, pb;
    
    printf("at first: a = %d. b = %d\n", a, b);

    pthread_key_create(&p_key, NULL);  /* 创建线程键值 */
    
    pthread_create(&pa, NULL, thread_func, &a); /* 创建线程1 */
    pthread_create(&pb, NULL, thread_func, &b); /* 创建线程2 */

    // 等待线程pa结束，防止主线程提前结束
    pthread_join(pa, NULL);
    // 等待线程pb结束，防止主线程提前结束
    pthread_join(pb, NULL);
    
    printf("at last: a = %d. b = %d\n", a, b);

    return 0;
}
```

测试结果如下

```c
at first: a = 10. b = 20
in thread 10. init specific_data to 10
get specific_data 10
change specific_data to 1000
get specific_data 1000
in thread 20. init specific_data to 20
get specific_data 20
change specific_data to 2000
get specific_data 2000
at last: a = 1000. b = 2000
```

函数`pthread_join`为主线程加塞，防止主线程提前结束，`pthread_join`强制主线程等待列表中的子线程结束。


