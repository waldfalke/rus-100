'use client';

import { useState } from 'react';
import { TokenDebugger } from '@/components/debug/TokenDebugger';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { TopNavBlock } from '@/components/ui/TopNavBlock';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgressPanelBlock } from '@/components/ui/ProgressPanelBlock';
import { SelectionDropdown } from '@/components/ui/SelectionDropdown';

export default function TokenTestPage() {
  const [value, setValue] = useState(0);
  const [tabValue, setTabValue] = useState('tab1');

  // Sample navigation links for TopNavBlock
  const navLinks = [
    { label: 'Дашборд', href: '#' },
    { label: 'Задания', href: '#' },
    { label: 'Результаты', href: '#' },
    { label: 'Тесты', href: '#' },
    { label: 'Демо', href: '/demo' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* TopNavBlock should be outside main content container */}
      <TopNavBlock 
        navLinks={navLinks}
        userName="Test User"
        userEmail="test@example.com"
      />
      
      <main className="flex-grow">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="font-source-serif-pro text-3xl font-bold mb-8">Design Token Test Page</h1>
          
          {/* Original token tests */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-background rounded-xl border shadow-sm">
              <h2 className="font-source-serif-pro text-xl font-semibold mb-4">Buttons & Progress</h2>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button variant="default">Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
                <Progress value={value} className="h-2" />
                <div className="flex justify-between">
                  <Button onClick={() => setValue(0)}>0%</Button>
                  <Button onClick={() => setValue(25)}>25%</Button>
                  <Button onClick={() => setValue(50)}>50%</Button>
                  <Button onClick={() => setValue(75)}>75%</Button>
                  <Button onClick={() => setValue(100)}>100%</Button>
                </div>
              </div>
            </div>

            <div className="p-6 bg-background rounded-xl border shadow-sm">
              <h2 className="font-source-serif-pro text-xl font-semibold mb-4">Tabs & Theme Toggle</h2>
              <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                  <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1" className="p-4 bg-muted rounded-lg">
                  <p>Tab 1 Content with token-based colors</p>
                </TabsContent>
                <TabsContent value="tab2" className="p-4 bg-muted rounded-lg">
                  <p>Tab 2 Content with token-based colors</p>
                </TabsContent>
              </Tabs>
              <div className="mt-4 flex justify-end">
                <ThemeToggle />
              </div>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <ProgressPanelBlock 
              totalSelected={3}
              totalLimit={5}
              progress={60}
              buttonText="Создать тест"
              onCreate={() => alert('Test creation started')}
            />
          </div>

          <div className="space-y-6 mb-8">
            <h2 className="font-source-serif-pro text-2xl font-bold">Selection Dropdown</h2>
            <SelectionDropdown
              options={[
                { id: "1", label: "Option 1", count: 10 },
                { id: "2", label: "Option 2", count: 5 },
                { id: "3", label: "Option 3", count: 8 },
              ]}
              selected={["any"]}
              onChange={(selected) => console.log('Selected:', selected)}
              label="Select options"
            />
          </div>

          <div className="mt-12">
            <TokenDebugger />
          </div>
        </div>
      </main>
    </div>
  );
}