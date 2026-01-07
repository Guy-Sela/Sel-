//------------- SECONDS ----------------

let s0 = document.getElementById("second0");
let s1 = document.getElementById("second1");
let s2 = document.getElementById("second2");
let s3 = document.getElementById("second3");
let s4 = document.getElementById("second4");
let s5 = document.getElementById("second5");
let s6 = document.getElementById("second6");
let s7 = document.getElementById("second7");
let s8 = document.getElementById("second8");
let s9 = document.getElementById("second9");
let s10 = document.getElementById("second10");
let s11 = document.getElementById("second11");
let s12 = document.getElementById("second12");
let s13 = document.getElementById("second13");
let s14 = document.getElementById("second14");
let s15 = document.getElementById("second15");
let s16 = document.getElementById("second16");
let s17 = document.getElementById("second17");
let s18 = document.getElementById("second18");
let s19 = document.getElementById("second19");
let s20 = document.getElementById("second20");
let s21 = document.getElementById("second21");
let s22 = document.getElementById("second22");
let s23 = document.getElementById("second23");
let s24 = document.getElementById("second24");
let s25 = document.getElementById("second25");
let s26 = document.getElementById("second26");
let s27 = document.getElementById("second27");
let s28 = document.getElementById("second28");
let s29 = document.getElementById("second29");
let s30 = document.getElementById("second30");
let s31 = document.getElementById("second31");
let s32 = document.getElementById("second32");
let s33 = document.getElementById("second33");
let s34 = document.getElementById("second34");
let s35 = document.getElementById("second35");
let s36 = document.getElementById("second36");
let s37 = document.getElementById("second37");
let s38 = document.getElementById("second38");
let s39 = document.getElementById("second39");
let s40 = document.getElementById("second40");
let s41 = document.getElementById("second41");
let s42 = document.getElementById("second42");
let s43 = document.getElementById("second43");
let s44 = document.getElementById("second44");
let s45 = document.getElementById("second45");
let s46 = document.getElementById("second46");
let s47 = document.getElementById("second47");
let s48 = document.getElementById("second48");
let s49 = document.getElementById("second49");
let s50 = document.getElementById("second50");
let s51 = document.getElementById("second51");
let s52 = document.getElementById("second52");
let s53 = document.getElementById("second53");
let s54 = document.getElementById("second54");
let s55 = document.getElementById("second55");
let s56 = document.getElementById("second56");
let s57 = document.getElementById("second57");
let s58 = document.getElementById("second58");
let s59 = document.getElementById("second59");

let divs_seconds = [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53, s54, s55, s56, s57, s58, s59];

let currentSecond_initial = new Date().getSeconds();
for (i = 0; i < currentSecond_initial; i++) {
    animateRandomlySeconds();
}



function animateRandomlySeconds() {

    let rand = divs_seconds[Math.floor(Math.random() * divs_seconds.length)];
    let z = divs_seconds.indexOf(rand);

    if (divs_seconds.length > 0) {
        rand.style.backgroundColor = 'rgb('+ Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ')';

                //                rand.classList.toggle('full');
                divs_seconds.splice(z, 1);

                if (divs_seconds.length === 0) {

                    animateRandomlyMinutes()

                }

            }
            else {

                divs_seconds.push(s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53, s54, s55, s56, s57, s58, s59);

                animateRandomlySeconds()

            }
        }


        //------------- MINUTES ------------------------

        let m0 = document.getElementById("minute0");
        let m1 = document.getElementById("minute1");
        let m2 = document.getElementById("minute2");
        let m3 = document.getElementById("minute3");
        let m4 = document.getElementById("minute4");
        let m5 = document.getElementById("minute5");
        let m6 = document.getElementById("minute6");
        let m7 = document.getElementById("minute7");
        let m8 = document.getElementById("minute8");
        let m9 = document.getElementById("minute9");
        let m10 = document.getElementById("minute10");
        let m11 = document.getElementById("minute11");
        let m12 = document.getElementById("minute12");
        let m13 = document.getElementById("minute13");
        let m14 = document.getElementById("minute14");
        let m15 = document.getElementById("minute15");
        let m16 = document.getElementById("minute16");
        let m17 = document.getElementById("minute17");
        let m18 = document.getElementById("minute18");
        let m19 = document.getElementById("minute19");
        let m20 = document.getElementById("minute20");
        let m21 = document.getElementById("minute21");
        let m22 = document.getElementById("minute22");
        let m23 = document.getElementById("minute23");
        let m24 = document.getElementById("minute24");
        let m25 = document.getElementById("minute25");
        let m26 = document.getElementById("minute26");
        let m27 = document.getElementById("minute27");
        let m28 = document.getElementById("minute28");
        let m29 = document.getElementById("minute29");
        let m30 = document.getElementById("minute30");
        let m31 = document.getElementById("minute31");
        let m32 = document.getElementById("minute32");
        let m33 = document.getElementById("minute33");
        let m34 = document.getElementById("minute34");
        let m35 = document.getElementById("minute35");
        let m36 = document.getElementById("minute36");
        let m37 = document.getElementById("minute37");
        let m38 = document.getElementById("minute38");
        let m39 = document.getElementById("minute39");
        let m40 = document.getElementById("minute40");
        let m41 = document.getElementById("minute41");
        let m42 = document.getElementById("minute42");
        let m43 = document.getElementById("minute43");
        let m44 = document.getElementById("minute44");
        let m45 = document.getElementById("minute45");
        let m46 = document.getElementById("minute46");
        let m47 = document.getElementById("minute47");
        let m48 = document.getElementById("minute48");
        let m49 = document.getElementById("minute49");
        let m50 = document.getElementById("minute50");
        let m51 = document.getElementById("minute51");
        let m52 = document.getElementById("minute52");
        let m53 = document.getElementById("minute53");
        let m54 = document.getElementById("minute54");
        let m55 = document.getElementById("minute55");
        let m56 = document.getElementById("minute56");
        let m57 = document.getElementById("minute57");
        let m58 = document.getElementById("minute58");
        let m59 = document.getElementById("minute59");


        let divs_minutes = [m0, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13, m14, m15, m16, m17, m18, m19, m20, m21, m22, m23, m24, m25, m26, m27, m28, m29, m30, m31, m32, m33, m34, m35, m36, m37, m38, m39, m40, m41, m42, m43, m44, m45, m46, m47, m48, m49, m50, m51, m52, m53, m54, m55, m56, m57, m58, m59];


        let currentMinute_initial = new Date().getMinutes();

        for (i = 0; i < currentMinute_initial; i++) {
            animateRandomlyMinutes();
        }

        function animateRandomlyMinutes() {

            let rand = divs_minutes[Math.floor(Math.random() * divs_minutes.length)];
            let z = divs_minutes.indexOf(rand);


            if (divs_minutes.length > 0) {
                rand.style.backgroundColor = 'rgb('+ Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ')';
                divs_minutes.splice(z, 1);

                if (divs_minutes.length === 0) {

                    animateRandomlyHours()

                }


            } else {

                divs_minutes.push(m0, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13, m14, m15, m16, m17, m18, m19, m20, m21, m22, m23, m24, m25, m26, m27, m28, m29, m30, m31, m32, m33, m34, m35, m36, m37, m38, m39, m40, m41, m42, m43, m44, m45, m46, m47, m48, m49, m50, m51, m52, m53, m54, m55, m56, m57, m58, m59);

                animateRandomlyMinutes()
            }
        }


        //            ----------- HOURS ----------
        let h0 = document.getElementById("hour0");
        let h1 = document.getElementById("hour1");
        let h2 = document.getElementById("hour2");
        let h3 = document.getElementById("hour3");
        let h4 = document.getElementById("hour4");
        let h5 = document.getElementById("hour5");
        let h6 = document.getElementById("hour6");
        let h7 = document.getElementById("hour7");
        let h8 = document.getElementById("hour8");
        let h9 = document.getElementById("hour9");
        let h10 = document.getElementById("hour10");
        let h11 = document.getElementById("hour11");
        let h12 = document.getElementById("hour12");
        let h13 = document.getElementById("hour13");
        let h14 = document.getElementById("hour14");
        let h15 = document.getElementById("hour15");
        let h16 = document.getElementById("hour16");
        let h17 = document.getElementById("hour17");
        let h18 = document.getElementById("hour18");
        let h19 = document.getElementById("hour19");
        let h20 = document.getElementById("hour20");
        let h21 = document.getElementById("hour21");
        let h22 = document.getElementById("hour22");
        let h23 = document.getElementById("hour23");


        let divs_hours = [h0, h1, h2, h3, h4, h5, h6, h7, h8, h9, h10, h11, h12, h13, h14, h15, h16, h17, h18, h19, h20, h21, h22, h23];


        let currentHour_initial = new Date().getHours();

        for (i = 0; i < currentHour_initial; i++) {
            animateRandomlyHours();
        }


        function animateRandomlyHours() {

            let rand = divs_hours[Math.floor(Math.random() * divs_hours.length)];
            let z = divs_hours.indexOf(rand);

            if (divs_hours.length > 0) {

                rand.style.backgroundColor = 'rgb('+ Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ')'
                
                divs_hours.splice(z, 1);

            } else {

                divs_hours.push(h0, h1, h2, h3, h4, h5, h6, h7, h8, h9, h10, h11, h12, h13, h14, h15, h16, h17, h18, h19, h20, h21, h22, h23);

            }
        }


        setInterval(animateRandomlySeconds, 1000)
