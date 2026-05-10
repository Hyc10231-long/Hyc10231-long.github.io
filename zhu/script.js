// 页面导航切换
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const backBtn = document.getElementById('backBtn');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const target = item.dataset.target;
        pages.forEach(p => p.classList.remove('show'));
        document.getElementById(`page-${target}`).classList.add('show');
    });
});

// 错误页返回IDE
backBtn.addEventListener('click', () => {
    navItems.forEach(i => i.classList.remove('active'));
    document.querySelector('.nav-item[data-target="ide"]').classList.add('active');
    pages.forEach(p => p.classList.remove('show'));
    document.getElementById('page-ide').classList.add('show');
});

// 初始化代码编辑器
let editor;
require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/@monaco-editor/browser-umd@0.44.0/min/vs' } });
require(['vs/editor/editor.main'], function () {
    editor = monaco.editor.create(document.getElementById('codeEditor'), {
        value: `#include <iostream>
#include <cmath>
#include <string>
using namespace std;

int main()
{
    // 支持 int float double bool string 全部类型
    int a = 10;
    double b = 3.14159;
    float c = 2.5f;
    string s = "完整C++编译可用";

    cout << "int a = " << a << endl;
    cout << "double b = " << b << endl;
    cout << "float c = " << c << endl;
    cout << "字符串：" << s << endl;

    // 数学函数直接能用
    cout << "根号16 = " << sqrt(16) << endl;

    return 0;
}`,
        language: 'cpp',
        theme: 'vs-dark',
        automaticLayout: true
    });
});

// 调用在线真实C++编译内核
document.getElementById('runBtn').addEventListener('click', async () => {
    const code = editor.getValue();
    const outputBox = document.getElementById('outputBox');
    outputBox.innerText = "正在编译运行中...";

    try {
        const res = await fetch('https://api.codetabs.com/v1/compilers/cpp', {
            method: 'POST',
            body: code
        });
        const data = await res.json();
        if(data.error){
            outputBox.innerText = "❌ 编译错误：\n" + data.error;
        }else{
            outputBox.innerText = "✅ 运行成功：\n" + data.compilerOut;
        }
    } catch (e) {
        outputBox.innerText = "❌ 编译服务器请求失败，请稍后重试";
    }
});