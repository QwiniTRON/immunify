import React from 'react';

import './about.scss';

import { BackButton, Layout, PageLayout } from '../../components';


type AboutProps = {}


export const About: React.FC<AboutProps> = (props) => {
  return (
    <Layout title="" BackButtonCustom={<BackButton text="назад" simpleBack />}>
      <PageLayout className="about-page">
        <h1 className="title">О приложении immufify</h1>

        
      </PageLayout>
    </Layout>
  );
};