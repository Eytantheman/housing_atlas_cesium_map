export interface AxoSlide {
  driveId: string;
  caption: string;
  pdfUrl: string;
}

export interface ThumbItem {
  driveId: string;
  caption: string;
}

export interface PanelContent {
  period?: string;
  programme?: string;
  units?: string;
  axos?: AxoSlide[];
  thumbs?: ThumbItem[];
}

export const PANEL_CONTENT: Record<number, PanelContent> = {
  27: {
    period: '1961–1970',
    programme: 'Student housing',
    units: '> 201',
    axos: [
      {
        driveId: '1tw7p4sTGURjXSkoOUHQ1X9MutWLbV54T',
        caption: '03.2324  Frank Ren, Ronald Vink, Youyou Yang, Ziqian Chen',
        pdfUrl: 'https://drive.google.com/file/d/1XLeFBbKaC3Z77w6ED31SJy-xD-r8FqqV/view',
      },
      {
        driveId: '1s_pyQKexLfYRo92zGJcR5tqUJc0KCG-D',
        caption: '03.2425  Ella Koehorst, Beate Verbeek, Nienke Hofte, Wiktoria Urban',
        pdfUrl: 'https://drive.google.com/file/d/1E3kRiOw_w_L-g0loMV99p4OY61QH4Eqp/view',
      },
    ],
    thumbs: [
      { driveId: '1Cah4RFAag022HUNvWKw5NwvuXqcpX8xQ', caption: '01.1  Hertzberger archive (1961)' },
      { driveId: '18p7R6MP7hv6lRm2MkYasp5WQS31oXqTt', caption: '01.2  Hertzberger archive (1961)' },
      { driveId: '1Rkm2RQzdXuJzj0PB8CJdqh6iGlM2RWzb', caption: '01.3  Hertzberger archive (1961)' },
      { driveId: '1G5Z4utCrR77N189E-vizYE4qnqsaCStJ', caption: '01.4  Hertzberger archive (1961)' },
      { driveId: '1IUSgQ8lCbWjypLSj_QcFwrhbeHPqpjrl', caption: '02.1  Photo: Johan van der Keuken (1961)' },
      { driveId: '1F6aKL63S9RwnnMsiG7eOAkz8cK6ZExsY', caption: '02.2  Photo: Johan van der Keuken (1961)' },
      { driveId: '1Bw-2j8fFTkVxxhNx3uidrLJj97rjqO23', caption: '02.3  Photo: Paul Hartland. Elegance, 1963' },
    ],
  },
};
