'use client';
import React from 'react';
import './access.css'
import Header from "@/app/components/header/page";
import Image from "next/image";
import Screen01 from "@/public/img/Screen01.png"

const Access = () =>{
    return(
        <>
        <Header></Header>
            <div id={"accessMain"}>
                <div id={"accessTitle"}>
                    <h1>Access</h1>
                    <p>施設案内</p>
                </div>
                <div className={"acInfo"} id={"acAccess"}>
                    <h2 className={"infoTitle"}>アクセス</h2>
                    <div className={"acContent"}>
                        <iframe id={"map"}
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1625.4570230765555!2d136.88595501725968!3d35.16793213217278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x600376de6175c84f%3A0x8705b08abf7309d6!2z44CSNDUwLTAwMDIg5oSb55-l55yM5ZCN5Y-k5bGL5biC5Lit5p2R5Yy65ZCN6aeF77yU5LiB55uu77yS77yX4oiS77yRIOODouODvOODieWtpuWckuOCueODkeOCpOODqeODq-OCv-ODr-ODvOOCuiBCMUY!5e0!3m2!1sja!2sjp!4v1747624112284!5m2!1sja!2sjp"
                                width="500" height="400" loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"></iframe>
                        <p className={"ml-10 mt-2"}>
                            〒450-0002 愛知県名古屋市中村区名駅４丁目２７−１<br/> 総合校舎スパイラルタワーズ<br/><br/>
                            名駅から徒歩5分<br/>
                            モード学園スパイラルタワーズ内
                        </p>
                    </div>
                </div>

                <div className={"acInfo"} id={"acEquip"}>
                    <h2 className={"infoTitle"}>劇場設備</h2>

                    <div className={'acContent flex-row justify-around'} id={"equipList"}>
                        <div className={'equip'}>
                            <Image src={Screen01} alt={"Screen01"} width={300} height={200}></Image>
                            <h3>大スクリーン 200席</h3>
                            <p>スクリーン1</p>
                            <p>スクリーン2</p>
                            <p>スクリーン3</p>
                        </div>
                        <div className={'equip'}>
                            <Image src={Screen01} alt={"Screen01"} width={300} height={200}></Image>
                            <h3>中スクリーン 120席</h3>
                            <p>スクリーン4</p>
                            <p>スクリーン5</p>
                        </div>
                        <div className={'equip'}>
                            <Image src={Screen01} alt={"Screen01"} width={300} height={200}></Image>
                            <h3>小スクリーン 70席</h3>
                            <p>スクリーン6</p>
                            <p>スクリーン7</p>
                            <p>スクリーン8</p>
                        </div>
                    </div>

                </div>

                <div className={"acInfo"} id={"acFee"}>
                    <h2 className={"infoTitle"}>チケット料金</h2>

                    <table className={"acContent"} id={"feeList"}>
                        <tbody>
                        <tr>
                        <th>一般</th>
                            <th>大学生等</th>
                            <th>中学・高校</th>
                            <th>小学生以下</th>
                        </tr>
                        <tr>
                            <td>1,800円</td>
                            <td>1,600円</td>
                            <td>1,400円</td>
                            <td>1,000円</td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>

        </>
    );
}

export default Access;