// material-ui
import Typography from '@mui/material/Typography';
import Footer from 'src/pages/extra-pages/footer.jsx';

// 라이브러리 추가
import ReactMarkdown from 'react-markdown';

// project import
import MainCard from 'components/MainCard';

// README 내용을 문자열로 정의
const readmeContent = `
# **Web Interface-Based Mesh WiFi Network Management Tool**

A web-based application to monitor and manage Mesh WiFi networks with real-time topology visualization and performance insights.

## **Features**
- **Network Performance Monitoring**
  - Measure key metrics: **Latency**, **Throughput**, and **Packet Loss**.
- **Device Management**
  - Display device on/off status.
  - Restart devices directly through the interface.
- **Topology Visualization**
  - Real-time display of the network topology formed by the nodes.
- **Image Information Page**
  - View and manage node-specific image data.

---

## **Table of Contents**
1. [Getting Started](#getting-started)
2. [Documentation](#documentation)
3. [Technology Stack](#technology-stack)
4. [Initial React Templates](#initial-react-templates)
5. [Troubleshooting](#troubleshooting)

---

## **Getting Started**

### **Installation Steps**
1. **Clone the Repository**  
   Clone the project from GitHub:  
   \`\`\`bash
   git clone https://github.com/KangYWon/Mesh_WiFi_WebInterface.git
   \`\`\`

2. **Install Dependencies**  
   Verify Node.js and npm versions:  
   \`\`\`bash
   node -v
   npm -v
   \`\`\`
   Install Yarn globally:
    \`\`\`bash
   npm install -g yarn
   \`\`\`

3. **Run the Project**
   Start the development server:
   \`\`\`bash
   yarn start
   \`\`\`
   Alternatively, run with custom host and port:
    \`\`\`bash
   HOST=0.0.0.0 PORT=3000 yarn start
   \`\`\`
---

## **Documentation**
Find detailed documentation and guidance for this project here:  
[Mantis Documentation](https://codedthemes.gitbook.io/mantis)

---

## **Technology Stack**
This project utilizes the following technologies:  
- **Frontend**:  
  - React  
  - Material UI V5 for UI components  
  - React Router for navigation  
- **State Management**: Redux Toolkit  
- **Build Tools**: Vite, Yarn  
- **Styling**: CSS-in-JS, Material Design

---

## **Initial React Templates**
Explore these free templates to enhance the admin dashboard design:  
[Materially Free ReactJS Admin Template](https://codedthemes.com/item/materially-free-reactjs-admin-template/)

---

## **Troubleshooting**

### Dependency Installation Issues
If dependencies fail to install, run:  
\`\`\`bash
yarn install
\`\`\`

### Module Not Found: \`@rollup/rollup-darwin-x64\`
Clean the project and reinstall dependencies:  
\`\`\`bash
rm -rf node_modules
rm package-lock.json
yarn install
\`\`\`
`;

// ==============================|| SAMPLE PAGE ||============================== //

export default function SamplePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <MainCard>
        {/* Markdown 콘텐츠를 렌더링 */}
        <ReactMarkdown>{readmeContent}</ReactMarkdown>
      </MainCard>
      <Footer />
    </div>
  );
}