"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MoreVertical, Edit, Archive, Trash2, Users, Folder, ArrowRight } from "lucide-react";
import { pluralizeStudents, pluralizeTests } from "@/lib/utils/pluralization";
import { H3, P } from "@/components/ui/typography";

interface GroupCardProps {
  id: string;
  name: string;
  description?: string;
  status: "active" | "archived" | "draft";
  participantCount: number;
  testsCount: number;
  createdAt: string;
  onEdit?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  onOpen?: (id: string) => void;
  onStudentsClick?: (id: string) => void;
  onTestsClick?: (id: string) => void;
  className?: string;
  isSelected?: boolean;
}

export function GroupCard({
  id,
  name,
  description,
  status,
  participantCount,
  testsCount,
  createdAt,
  onEdit,
  onArchive,
  onDelete,
  onOpen,
  onStudentsClick,
  onTestsClick,
  className,
  isSelected = false
}: GroupCardProps) {
  
  const getStatusBadge = () => {
    switch (status) {
      case "active":
        return (
          <Badge
            variant="outline"
            className="px-2 py-1 text-xs font-medium bg-background"
          >
            Активная
          </Badge>
        );
      case "archived":
        return (
          <Badge
            variant="outline"
            className="px-2 py-1 text-xs font-medium bg-background"
          >
            Архивная
          </Badge>
        );
      case "draft":
        return (
          <Badge
            variant="outline"
            className="px-2 py-1 text-xs font-medium bg-background"
          >
            Черновик
          </Badge>
        );
      default:
        return null;
    }
  };

  const cardClasses = `
    group transition-all duration-200 ease-in-out
    hover:border-green-600 hover:shadow-md
    ${isSelected ? 'ring-2 ring-primary shadow-lg' : ''}
    ${className || ''}
  `;

  return (
    <Card
      className={cardClasses}
    >
      <CardHeader className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Заголовок и статус */}
            <div className="flex items-center gap-3 mb-2">
              <H3 
                className="truncate"
              >
                {name}
              </H3>
              {getStatusBadge()}
            </div>
            
            {/* Описание */}
            {description && (
              <P 
                className="line-clamp-2 text-muted-foreground mb-4"
              >
                {description}
              </P>
            )}
          </div>
          
          {/* Кнопка управления */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-48 p-2 bg-card text-card-foreground border rounded-md shadow-md"
            >
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-8 px-2 text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(id);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Редактировать
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-8 px-2 text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchive?.(id);
                  }}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  В архив
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-8 px-2 text-sm text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(id);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Удалить
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      
      <CardContent className="px-6 pb-6 pt-0">
        {/* Метаданные */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onStudentsClick?.(id);
              }}
            >
              <Users className="h-4 w-4 mr-1.5" />
              <span>{pluralizeStudents(participantCount)}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onTestsClick?.(id);
              }}
            >
              <Folder className="h-4 w-4 mr-1.5" />
              <span>{pluralizeTests(testsCount)}</span>
            </Button>
          </div>

          {/* Кнопка действия */}
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 group-hover:w-auto group-hover:px-3 transition-all duration-200 ease-in-out"
            onClick={(e) => {
              e.stopPropagation();
              onOpen?.(id);
            }}
          >
            <span className="hidden group-hover:inline-block mr-1 text-sm">Перейти</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}