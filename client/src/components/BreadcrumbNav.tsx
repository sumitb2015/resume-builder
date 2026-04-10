import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { House } from "lucide-react";

type View = 'landing' | 'login' | 'plan-select' | 'mode-select' | 'builder' | 'preview' | 'ats-checker' | 'job-tailor' | 'ai-writer' | 'blog';

interface BreadcrumbNavProps {
  view: View;
  onNavigate: (view: View) => void;
  className?: string;
  currentLabel?: string;
}

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ view, onNavigate, className, currentLabel }) => {
  if (view === 'landing') return null;

  const renderBreadcrumbs = () => {
    const items = [];

    // All pages start with Home (unless it's landing itself, but we handle that above)
    items.push(
      <BreadcrumbItem key="home">
        <BreadcrumbLink 
          onClick={() => onNavigate('landing')}
          className="cursor-pointer flex items-center gap-1.5"
        >
          <House className="h-3.5 w-3.5" />
          Home
        </BreadcrumbLink>
      </BreadcrumbItem>
    );

    if (view === 'blog') {
      items.push(<BreadcrumbSeparator key="sep-blog" />);
      if (currentLabel) {
        items.push(
          <BreadcrumbItem key="blog">
            <BreadcrumbLink onClick={() => onNavigate('blog')} className="cursor-pointer">
              Blog
            </BreadcrumbLink>
          </BreadcrumbItem>
        );
        items.push(<BreadcrumbSeparator key="sep-article" />);
        items.push(<BreadcrumbItem key="article"><BreadcrumbPage>{currentLabel}</BreadcrumbPage></BreadcrumbItem>);
      } else {
        items.push(<BreadcrumbItem key="blog"><BreadcrumbPage>Blog</BreadcrumbPage></BreadcrumbItem>);
      }
    } else if (view === 'login') {
      items.push(<BreadcrumbSeparator key="sep-login" />);
      items.push(<BreadcrumbItem key="login"><BreadcrumbPage>Login</BreadcrumbPage></BreadcrumbItem>);
    } else if (view === 'plan-select') {
      items.push(<BreadcrumbSeparator key="sep-plans" />);
      items.push(<BreadcrumbItem key="plans"><BreadcrumbPage>Plans</BreadcrumbPage></BreadcrumbItem>);
    } else {
      // Dashboard/Flow hierarchy
      items.push(<BreadcrumbSeparator key="sep-dash" />);
      
      if (view === 'mode-select') {
        items.push(<BreadcrumbItem key="dash"><BreadcrumbPage>Dashboard</BreadcrumbPage></BreadcrumbItem>);
      } else {
        items.push(
          <BreadcrumbItem key="dash">
            <BreadcrumbLink onClick={() => onNavigate('mode-select')} className="cursor-pointer">
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
        );
        
        items.push(<BreadcrumbSeparator key="sep-builder" />);
        
        if (view === 'builder') {
          items.push(<BreadcrumbItem key="builder"><BreadcrumbPage>Resume Builder</BreadcrumbPage></BreadcrumbItem>);
        } else {
          items.push(
            <BreadcrumbItem key="builder">
              <BreadcrumbLink onClick={() => onNavigate('builder')} className="cursor-pointer">
                Resume Builder
              </BreadcrumbLink>
            </BreadcrumbItem>
          );
          
          items.push(<BreadcrumbSeparator key="sep-last" />);
          
          if (view === 'preview') {
            items.push(<BreadcrumbItem key="preview"><BreadcrumbPage>Preview & Export</BreadcrumbPage></BreadcrumbItem>);
          } else if (view === 'ats-checker') {
            items.push(<BreadcrumbItem key="ats"><BreadcrumbPage>ATS Checker</BreadcrumbPage></BreadcrumbItem>);
          } else if (view === 'job-tailor') {
            items.push(<BreadcrumbItem key="tailor"><BreadcrumbPage>Job Tailor</BreadcrumbPage></BreadcrumbItem>);
          } else if (view === 'ai-writer') {
            items.push(<BreadcrumbItem key="writer"><BreadcrumbPage>AI Writer</BreadcrumbPage></BreadcrumbItem>);
          }
        }
      }
    }

    return items;
  };

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {renderBreadcrumbs()}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbNav;
