import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UniversitySchema } from '../persistence/schemas/university.schema';

@Injectable()
export class UniversitySeeder {
  private readonly logger = new Logger(UniversitySeeder.name);

  constructor(
    @InjectRepository(UniversitySchema)
    private readonly universityRepository: Repository<UniversitySchema>,
  ) { }

  /**
   * Seed 데이터 삽입 (Upsert 방식)
   * domain을 기준으로 중복 체크하여 업데이트 또는 삽입
   */
  async seed(): Promise<void> {
    this.logger.log('🌱 대학 데이터 시딩 시작...');

    const universities = [
      { name: '서울대학교', domain: 'snu.ac.kr' },
      { name: '연세대학교', domain: 'yonsei.ac.kr' },
      { name: '고려대학교', domain: 'korea.ac.kr' },
      { name: '성균관대학교', domain: 'skku.edu' },
      { name: '한양대학교', domain: 'hanyang.ac.kr' },
      { name: '서강대학교', domain: 'sogang.ac.kr' },
      { name: '중앙대학교', domain: 'cau.ac.kr' },
      { name: '경희대학교', domain: 'khu.ac.kr' },
      { name: '한국외국어대학교', domain: 'hufs.ac.kr' },
      { name: '서울시립대학교', domain: 'uos.ac.kr' },
      { name: '건국대학교', domain: 'konkuk.ac.kr' },
      { name: '동국대학교', domain: 'dongguk.edu' },
      { name: '홍익대학교', domain: 'hongik.ac.kr' },
      { name: '숙명여자대학교', domain: 'sookmyung.ac.kr' },
      { name: '이화여자대학교', domain: 'ewhain.net' },
      { name: '서울여자대학교', domain: 'swu.ac.kr' },
      { name: '성신여자대학교', domain: 'sungshin.ac.kr' },
      { name: '덕성여자대학교', domain: 'duksung.ac.kr' },
      { name: '동덕여자대학교', domain: 'dongduk.ac.kr' },
      { name: '광운대학교', domain: 'kw.ac.kr' },
      { name: '국민대학교', domain: 'kookmin.ac.kr' },
      { name: '명지대학교', domain: 'mju.ac.kr' },
      { name: '상명대학교', domain: 'sangmyung.kr' },
      { name: '서울과학기술대학교', domain: 'seoultech.ac.kr' },
      { name: '서경대학교', domain: 'skuniv.ac.kr' },
      { name: '세종대학교', domain: 'sju.ac.kr' },
      { name: '숭실대학교', domain: 'soongsil.ac.kr' },
      { name: '인하대학교', domain: 'inha.edu' },
      { name: '아주대학교', domain: 'ajou.ac.kr' },
      { name: '인천대학교', domain: 'inu.ac.kr' },
      { name: '경기대학교', domain: 'kyonggi.ac.kr' },
      { name: '단국대학교', domain: 'dankook.ac.kr' },
      { name: '가천대학교', domain: 'gachon.ac.kr' },
      { name: '수원대학교', domain: 'suwon.ac.kr' },
      { name: '안양대학교', domain: 'ayum.anyang.ac.kr' },
      { name: '용인대학교', domain: 'yiu.ac.kr' },
      { name: '성결대학교', domain: 'sungkyul.ac.kr' },
      { name: '한국과학기술원', domain: 'kaist.ac.kr' },
      { name: '포항공과대학교', domain: 'postech.ac.kr' },
      { name: '광주과학기술원', domain: 'gist.ac.kr' },
      { name: '대구경북과학기술원', domain: 'dgist.ac.kr' },
      { name: '울산과학기술원', domain: 'unist.ac.kr' },
      { name: '부산대학교', domain: 'pusan.ac.kr' },
      { name: '경북대학교', domain: 'knu.ac.kr' },
      { name: '전남대학교', domain: 'jnu.ac.kr' },
      { name: '전북대학교', domain: 'jbnu.ac.kr' },
      { name: '충남대학교', domain: 'cnu.ac.kr' },
      { name: '충북대학교', domain: 'chungbuk.ac.kr' },
      { name: '강원대학교', domain: 'kangwon.ac.kr' },
      { name: '제주대학교', domain: 'jejunu.ac.kr' },
      { name: '경상국립대학교', domain: 'gnu.ac.kr' },
      { name: '부경대학교', domain: 'pukyong.ac.kr' },
      { name: '동아대학교', domain: 'donga.ac.kr' },
      { name: '부산외국어대학교', domain: 'bufs.ac.kr' },
      { name: '동서대학교', domain: 'dongseo.ac.kr' },
      { name: '동의대학교', domain: 'deu.ac.kr' },
      { name: '영남대학교', domain: 'ynu.ac.kr' },
      { name: '계명대학교', domain: 'kmu.ac.kr' },
      { name: '대구대학교', domain: 'daegu.ac.kr' },
      { name: '대구가톨릭대학교', domain: 'cu.ac.kr' },
      { name: '금오공과대학교', domain: 'kumoh.ac.kr' },
      { name: '조선대학교', domain: 'chosun.kr' },
      { name: '목포대학교', domain: 'mokpo.ac.kr' },
      { name: '순천향대학교', domain: 'sch.ac.kr' },
      { name: '한남대학교', domain: 'hannam.ac.kr' },
      { name: '배재대학교', domain: 'pcu.ac.kr' },
      { name: '공주대학교', domain: 'smail.kongju.ac.kr' },
      { name: '한밭대학교', domain: 'hanbat.ac.kr' },
      { name: '강릉원주대학교', domain: 'gwnu.ac.kr' },
      { name: '한림대학교', domain: 'hallym.ac.kr' },
      { name: '상지대학교', domain: 'sangji.ac.kr' },
      { name: '서울교육대학교', domain: 'snue.ac.kr' },
      { name: '경인교육대학교', domain: 'ginue.ac.kr' },
      { name: '부산교육대학교', domain: 'bnue.ac.kr' },
      { name: '대구교육대학교', domain: 'dnue.ac.kr' },
      { name: '광주교육대학교', domain: 'gnue.ac.kr' },
      { name: '전주교육대학교', domain: 'jnue.kr' },
      { name: '청주교육대학교', domain: 'cje.ac.kr' },
      { name: '춘천교육대학교', domain: 'cnue.ac.kr' },
      { name: '진주교육대학교', domain: 'cue.ac.kr' },
      { name: '제주교육대학교', domain: 'jejue.ac.kr' },
      { name: '공주교육대학교', domain: 'gjue.ac.kr' },
      { name: '한국교원대학교', domain: 'knue.ac.kr' },
      { name: '한국체육대학교', domain: 'knsu.ac.kr' },
      { name: '한국예술종합학교', domain: 'karts.ac.kr' },
      { name: '한국전통문화대학교', domain: 'nuch.ac.kr' },
      { name: '한국항공대학교', domain: 'kau.kr' },
      { name: '한국해양대학교', domain: 'kmou.ac.kr' },
      { name: '목포해양대학교', domain: 'mmu.ac.kr' },
      { name: '한국기술교육대학교', domain: 'koreatech.ac.kr' },
      { name: '한국산업기술대학교', domain: 'kpu.ac.kr' },
      { name: '한국교통대학교', domain: 'ut.ac.kr' },
      { name: '경희사이버대학교', domain: 'khcu.ac.kr' },
      { name: '고려사이버대학교', domain: 'cuk.edu' },
      { name: '한양사이버대학교', domain: 'hycu.ac.kr' },
      { name: '서울디지털대학교', domain: 'sdu.ac.kr' },
      { name: '서울사이버대학교', domain: 'iscu.ac.kr' },
      { name: '세종사이버대학교', domain: 'sjcu.ac.kr' },
      { name: '숭실사이버대학교', domain: 'kcu.ac' },
      { name: '원광디지털대학교', domain: 'wdu.ac.kr' },
      { name: '가톨릭대학교', domain: 'catholic.ac.kr' },
      { name: '성공회대학교', domain: 'skhu.ac.kr' },
      { name: '선문대학교', domain: 'sunmoon.ac.kr' },
      { name: '한동대학교', domain: 'handong.edu' },
      { name: '울산대학교', domain: 'ulsan.ac.kr' },
      { name: '경주대학교', domain: 'gju.ac.kr' },
      { name: '동명대학교', domain: 'tu.ac.kr' },
      { name: '김천대학교', domain: 'gimcheon.ac.kr' },
      { name: '송원대학교', domain: 'songwon.ac.kr' },
      { name: '우송대학교', domain: 'wsu.ac.kr' },
      { name: '청주대학교', domain: 'cju.ac.kr' },
      { name: '한경국립대학교', domain: 'hknu.ac.kr' },
      { name: '한서대학교', domain: 'hanseo.ac.kr' },
      { name: '테스트대학교', domain: 'gmail.com' },
    ];

    await this.universityRepository.upsert(universities, ['domain']);

    this.logger.log(`✅ 대학 시드 완료: ${universities.length}개의 대학 시드`);
  }
}

