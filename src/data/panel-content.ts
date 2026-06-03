export interface AxoSlide {
  src: string;
  caption: string;
  pdfUrl: string;
}

export interface ThumbItem {
  src: string;
  caption: string;
}

export interface PanelContent {
  period?: string;
  programme?: string;
  units?: string;
  description?: string;
  axos?: AxoSlide[];
  thumbs?: ThumbItem[];
}

export const PANEL_CONTENT: Record<number, PanelContent> = {
  27: {
    period: '1961–1970',
    programme: 'Student housing',
    units: '> 201',
    description: `Herman Hertzberger (1932) is a Dutch architect from the 20th century. As a key figure in Structuralism, he is known for designing buildings that encourage interaction, adaptability, and user participation. Right after his studies, he founded his own office in Amsterdam, where he began developing his vision of an architecture based on human relationships, an architecture of encounter and connection.

Built in 1966 in response to a shortage of student housing, the Weesperflat became one of the city's first major student apartment complexes. It consists of seven floors, each divided into two long corridors containing student rooms. The fourth floor offered apartments for married students and included a large shared balcony with views over the city.

Beyond the private rooms, Hertzberger placed strong emphasis on shared spaces. The building features a communal café run by the students themselves and a canteen open not only to residents but to other Amsterdam locals, blurring the line between private and public life.`,
    axos: [
      {
        src: '/images/27/axo-0.jpg',
        caption: '03.2324  Frank Ren, Ronald Vink, Youyou Yang, Ziqian Chen',
        pdfUrl: 'https://drive.google.com/file/d/1XLeFBbKaC3Z77w6ED31SJy-xD-r8FqqV/view',
      },
      {
        src: '/images/27/axo-1.jpg',
        caption: '03.2425  Ella Koehorst, Beate Verbeek, Nienke Hofte, Wiktoria Urban',
        pdfUrl: 'https://drive.google.com/file/d/1E3kRiOw_w_L-g0loMV99p4OY61QH4Eqp/view',
      },
    ],
    thumbs: [
      { src: '/images/27/thumb-0.jpg', caption: '01.1  Hertzberger archive (1961)' },
      { src: '/images/27/thumb-1.jpg', caption: '01.2  Hertzberger archive (1961)' },
      { src: '/images/27/thumb-2.jpg', caption: '01.3  Hertzberger archive (1961)' },
      { src: '/images/27/thumb-3.jpg', caption: '01.4  Hertzberger archive (1961)' },
      { src: '/images/27/thumb-4.jpg', caption: '02.1  Photo: Johan van der Keuken (1961)' },
      { src: '/images/27/thumb-5.jpg', caption: '02.2  Photo: Johan van der Keuken (1961)' },
      { src: '/images/27/thumb-6.jpg', caption: '02.3  Photo: Paul Hartland. Elegance, 1963' },
    ],
  },
};
