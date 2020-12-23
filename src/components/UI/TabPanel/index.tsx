import React from 'react';


type TabPanelProps = {
  index: any
  value: any
  [p: string]: any
}

export const AppTabPanel: React.FC<TabPanelProps> = function (props) {
  const { children, value, index, ...other } = props;

  if (value !== index) return null;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {children}
    </div>
  );
}