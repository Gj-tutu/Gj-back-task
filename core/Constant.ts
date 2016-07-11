/**
 * Created by tutu on 16-1-4.
 */

// api 返回错误码
export const NO_FIND = "0";
export const NO_FIND_STATUS = 404;
export const NEED_LOGIN = "1";
export const NEED_LOGIN_STATUS = 201;

export const OTHER_ERROR_STATUS = 500;
export const SUCCESS_STATUS = 200;

// Task 任务类型
export const TASK_TYPE_PLAYBOOK = 1; // playbook
export const TASK_TYPE_ADDPLAYBOOK = 2; // 添加playbook
export const TASK_TYPE_AUTOPLAYBOOK = 3; // 查询自动playbook

// Task 任务执行返回状态
export const TASK_OVER = 1; // 任务完成
export const TASK_AGAIN = 2; // 任务重启
export const TASK_CANCEL = 3; // 任务取消

// playbook scriptHandle返回命令
export const SCRIPT_NEXT_COMMAND = 1; //执行下一个
export const SCRIPT_CANCEL_COMMAND = 2; //取消执行

// playbook和script 状态
export const WAIT:number = 1; //等待执行
export const ING:number = 2; //执行中
export const END:number = 3; //执行结束
export const CANCEL:number = 4; //取消执行
export const BREAK:number = 5; //错误中断
export const STOP:number = 6; //停止执行

export const UNKNOWN:number = 0; //未知


export const playBookStatus: any = {
    1: "等待执行",
    2: "执行中",
    3: "执行结束",
    4: "取消执行",
    5: "错误中断",
    6: "停止执行"
};

// script执行状态
export const SUCCESS:number = 1; //执行成功
export const FAIL:number = 2; //执行失败

// script执行结果状态
export const NORMAL:number = 1; //正常
export const WARN:number = 2; //警告
export const ERROR:number = 3; //错误

// scriptGroup状态
export const GROUP_WAIT:number = 1; //等待执行
export const GROUP_ING:number = 2; //执行中
export const GROUP_END:number = 3; //执行结束
export const GROUP_CANCEL:number = 4; //取消执行