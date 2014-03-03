# proc_stat

```
/proc/stat
kernel/system statistics.  Varies with architecture.  Common entries include:

	cpu  3357 0 4313 1362393
The  amount of time, measured in units of USER_HZ (1/100ths of a second on most architectures, use sysconf(_SC_CLK_TCK) to obtain the right value), that the system spent in user
mode, user mode with low priority (nice), system mode, and the idle task, respectively.  The last value should be USER_HZ times the second entry in the uptime pseudo-file.

	In Linux 2.6 this line includes three additional columns: iowait - time waiting for I/O to complete (since 2.5.41); irq - time servicing interrupts (since 2.6.0-test4);  softirq
- time servicing softirqs (since 2.6.0-test4).

Since Linux 2.6.11, there is an eighth column, steal - stolen time, which is the time spent in other operating systems when running in a virtualized environment

Since Linux 2.6.24, there is a ninth column, guest, which is the time spent running a virtual CPU for guest operating systems under the control of the Linux kernel.

	page 5741 1808
The number of pages the system paged in and the number that were paged out (from disk).

swap 1 0
The number of swap pages that have been brought in and out.

	intr 1462898
This line shows counts of interrupts serviced since boot time, for each of the possible system interrupts.  The first column is the total of all interrupts serviced; each subse‐
quent column is the total for a particular interrupt.

	disk_io: (2,0):(31,30,5764,1,2) (3,0):...
(major,disk_idx):(noinfo, read_io_ops, blks_read, write_io_ops, blks_written)
	(Linux 2.4 only)

ctxt 115315
The number of context switches that the system underwent.

	btime 769041601
boot time, in seconds since the Epoch, 1970-01-01 00:00:00 +0000 (UTC).

	processes 86031
Number of forks since boot.

	procs_running 6
Number of processes in runnable state.  (Linux 2.5.45 onward.)

procs_blocked 2
Number of processes blocked waiting for I/O to complete.  (Linux 2.5.45 onward.)

```





* Example


```
[root@root c_study]# cat /proc/stat 
cpu  15579 99 13680 698457 10939 40 651 0 0
cpu0 1669 7 1974 338065 1396 5 9 0 0
cpu1 13910 91 11705 360391 9542 35 641 0 0
intr 957831 163 8 0 1 1 0 5 0 1 0 0 0 101 0 0 3582 0 37804 3657 22410 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 
ctxt 501479
btime 1363495431
processes 40101
procs_running 1
procs_blocked 0
softirq 1396087 0 693403 12972 15932 35928 3 44577 479 592793


第一行的数值表示的是CPU总的使用情况，所以我们只要用第一行的数字计算就可以了。下表解析第一行各数值的含义：
参数          解析（单位：jiffies）
(jiffies是内核中的一个全局变量，用来记录自系统启动一来产生的节拍数，在linux中，一个节拍大致可理解为操作系统进程调度的最小时间片，不同linux内核可能值有不同，通常在1ms到10ms之间)
user ( 15579 )    从系统启动开始累计到当前时刻，处于用户态的运行时间，不包含 nice值为负进程。
nice (99)      从系统启动开始累计到当前时刻，nice值为负的进程所占用的CPU时间
system (13680)  从系统启动开始累计到当前时刻，处于核心态的运行时间
idle (698457)   从系统启动开始累计到当前时刻，除IO等待时间以外的其它等待时间
iowait (10939) 从系统启动开始累计到当前时刻，IO等待时间(since 2.5.41)
irq (40)           从系统启动开始累计到当前时刻，硬中断时间(since 2.6.0-test4)
softirq (651)      从系统启动开始累计到当前时刻，软中断时间(since 2.6.0-test4)
stealstolen(0)     which is the time spent in other operating systems when running in a virtualized environment(since 2.6.11)
guest(0)        which is the time spent running a virtual  CPU  for  guest operating systems under the control of the Linux kernel(since 2.6.24)
 结论：总的cpu时间totalCpuTime = user + nice + system + idle + iowait + irq + softirq + stealstolen +guest

```