"use strict";(self.webpackChunkcapkeeper_app=self.webpackChunkcapkeeper_app||[]).push([[76],{4450:(p,u,o)=>{o.d(u,{m:()=>h});var t=o(4438);let h=(()=>{class g{constructor(){this.currentPage=1,this.pageSize=25}previousPage(){this.currentPage>1&&this.currentPage--}nextPage(){this.currentPage<this.totalPages&&this.currentPage++}setPage(i){this.currentPage=i}getPageStart(){return this.currentPage%this.pageSize*this.pageSize-(this.pageSize-1)}getPageEnd(i){return i?Math.min(this.currentPage%this.pageSize*this.pageSize,i.length):0}generatePageArray(){let i=[];if(this.currentPage<=3){const e=Math.min(5,this.totalPages);for(let s=1;s<=e;s++)i.push(s);return i}if(this.currentPage>=this.totalPages-2){for(let s=Math.max(this.totalPages-4,1);s<=this.totalPages;s++)i.push(s);return i}for(let e=this.currentPage-2;e<=this.currentPage+2;e++)i.push(e);return i}setPageSize(i,e){this.pageSize=i,this.setPage(1),this.totalPages=Math.ceil(e.length/this.pageSize)}calculateTotalPages(i){this.totalPages=Math.ceil(i.length/this.pageSize)}static{this.\u0275fac=function(e){return new(e||g)}}static{this.\u0275prov=t.jDH({token:g,factory:g.\u0275fac,providedIn:"root"})}}return g})()},6455:(p,u,o)=>{o.d(u,{x:()=>g});var t=o(1626),h=o(4438);let g=(()=>{class c{constructor(e){this.http=e}getAllPlayers(e){return this.http.get(`api/${e}/players`)}getPlayerByID(e){const r=(new t.Nl).set("id",e);return this.http.get("api/get-player",{params:r})}getDraftByYear(e,s){const r=`api/${e}/draft`,d=(new t.Nl).set("year",s);return this.http.get(r,{params:d})}getProtectionSheet(e,s){return this.http.get(`api/${e}/${s}/protection-sheet`)}static{this.\u0275fac=function(s){return new(s||c)(h.KVO(t.Qq))}}static{this.\u0275prov=h.jDH({token:c,factory:c.\u0275fac,providedIn:"root"})}}return c})()},5118:(p,u,o)=>{o.d(u,{C:()=>g});var t=o(4438),h=o(1626);let g=(()=>{class c{constructor(e){this.http=e,this.sortColumn="last_name",this.sortDirection="asc"}sort(e,s,r){return s?e.sort((d,a)=>{const n=d[s],l=a[s];return"asc"===r?n>l?1:-1:n<l?1:-1}):(this.sortColumn=s,e)}toggleSort(e,s,r){s===this.sortColumn?this.sortDirection="asc"===this.sortDirection?"desc":"asc":(this.sortColumn=s,this.sortDirection="desc"),this.sort(e,s,this.sortDirection),r&&this.sort(e,r,this.sortDirection)}static{this.\u0275fac=function(s){return new(s||c)(t.KVO(h.Qq))}}static{this.\u0275prov=t.jDH({token:c,factory:c.\u0275fac,providedIn:"root"})}}return c})()},6884:(p,u,o)=>{o.d(u,{f:()=>s});var t=o(4438),h=o(177);function g(r,d){1&r&&(t.j41(0,"div",9),t.qSk(),t.j41(1,"svg",10),t.nrm(2,"path",11),t.k0s()())}function c(r,d){1&r&&(t.j41(0,"div",12),t.qSk(),t.j41(1,"svg",10),t.nrm(2,"path",13),t.k0s()())}function i(r,d){if(1&r){const a=t.RV6();t.j41(0,"div",1),t.DNE(1,g,3,0,"div",2)(2,c,3,0,"div",3),t.j41(3,"div",4),t.EFF(4),t.k0s(),t.j41(5,"button",5),t.bIt("click",function(){t.eBV(a);const l=t.XpG();return t.Njj(l.dismissToast())}),t.j41(6,"span",6),t.EFF(7,"Close"),t.k0s(),t.qSk(),t.j41(8,"svg",7),t.nrm(9,"path",8),t.k0s()()()}if(2&r){const a=t.XpG();t.R7$(),t.Y8G("ngIf",a.isSuccessful),t.R7$(),t.Y8G("ngIf",!a.isSuccessful),t.R7$(2),t.SpI(" ",a.message," ")}}let e=(()=>{class r{constructor(){this.isSuccessful=!0,this.isVisible=!0}ngOnInit(){this.autoDismiss()}ngOnDestroy(){this.timeoutHandle&&clearTimeout(this.timeoutHandle)}dismissToast(){this.isVisible=!1}autoDismiss(a=4500){this.timeoutHandle=setTimeout(()=>this.dismissToast(),a)}static{this.\u0275fac=function(n){return new(n||r)}}static{this.\u0275cmp=t.VBU({type:r,selectors:[["app-toast"]],inputs:{message:"message",isSuccessful:"isSuccessful"},decls:1,vars:1,consts:[["id","toast","class","toast fixed bottom-4 right-4 w-auto max-w-lg p-4 mb-4 flex items-center justify-between text-gray-500 bg-white rounded-lg shadow-lg dark:text-gray-400 dark:bg-gray-800","role","alert",4,"ngIf"],["id","toast","role","alert",1,"toast","fixed","bottom-4","right-4","w-auto","max-w-lg","p-4","mb-4","flex","items-center","justify-between","text-gray-500","bg-white","rounded-lg","shadow-lg","dark:text-gray-400","dark:bg-gray-800"],["class","flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-400 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200 mr-3",4,"ngIf"],["class","flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-400 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200 mr-3",4,"ngIf"],[1,"text-gray-800","toast-message","flex-grow","text-sm","font-semibold","max-w-60"],["type","button","aria-label","Close",1,"ms-3","-mx-1.5","-my-1.5","bg-white","text-gray-400","hover:text-gray-900","rounded-lg","focus:ring-2","focus:ring-gray-300","p-1.5","hover:bg-gray-100","inline-flex","items-center","justify-center","h-8","w-8","dark:text-gray-500","dark:hover:text-white","dark:bg-gray-800","dark:hover:bg-gray-700",3,"click"],[1,"sr-only"],["aria-hidden","true","xmlns","http://www.w3.org/2000/svg","fill","none","viewBox","0 0 14 14",1,"w-3","h-3"],["stroke","currentColor","stroke-linecap","round","stroke-linejoin","round","stroke-width","2","d","m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"],[1,"flex","items-center","justify-center","flex-shrink-0","w-8","h-8","text-green-400","bg-green-100","rounded-lg","dark:bg-green-800","dark:text-green-200","mr-3"],["aria-hidden","true","xmlns","http://www.w3.org/2000/svg","fill","currentColor","viewBox","0 0 20 20",1,"w-5","h-5"],["d","M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"],[1,"flex","items-center","justify-center","flex-shrink-0","w-8","h-8","text-red-400","bg-red-100","rounded-lg","dark:bg-red-800","dark:text-red-200","mr-3"],["d","M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"]],template:function(n,l){1&n&&t.DNE(0,i,10,3,"div",0),2&n&&t.Y8G("ngIf",l.isVisible)},dependencies:[h.bT],encapsulation:2})}}return r})(),s=(()=>{class r{constructor(a,n){this.appRef=a,this.injector=n}showToast(a,n){const l=(0,t.a0P)(e,{environmentInjector:this.appRef.injector});l.instance.message=a,l.instance.isSuccessful=n,this.appRef.attachView(l.hostView);const f=l.hostView.rootNodes[0];document.body.appendChild(f),setTimeout(()=>{this.dismissToast(l,f)},4500)}dismissToast(a,n){this.appRef.detachView(a.hostView),n.remove()}static{this.\u0275fac=function(n){return new(n||r)(t.KVO(t.o8S),t.KVO(t.zZn))}}static{this.\u0275prov=t.jDH({token:r,factory:r.\u0275fac,providedIn:"root"})}}return r})()}}]);