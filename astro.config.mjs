// @ts-check                                  │
import { defineConfig } from 'astro/config';                                          
import tailwindcss from '@tailwindcss/vite';                                       
import sitemapIntegration from '@astrojs/sitemap';     
                                            
export default defineConfig({               
  integrations: [sitemapIntegration()],                
  site: 'https://jkblog.vercel.app',        
  vite: {                                   
    plugins: [tailwindcss()]                
  }                                         
});                                         
                                            
function sitemap() {                        
  return {                                  
    name: 'sitemap',                        
    hooks: {}                               
  };                                        
} 